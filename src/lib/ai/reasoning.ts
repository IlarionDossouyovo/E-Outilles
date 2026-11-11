// Reasoning layer: a premium two-pass generation used by reasoning-capable
// agents. Pass 1 analyses the request like a human expert would (intent,
// missing information, plan, tone) and, when useful, selects real catalog
// products. Pass 2 produces the final answer grounded in that analysis.
//
// The analysis stays internal: the user only ever sees the final answer.

import { prisma } from '@/lib/db/prisma'
import { generateText, extractJson, type ChatTurn, type InlineMedia } from './provider'
import { AGENTS, reasoningInstruction, toneInstruction, type AgentId } from './agents'

export interface ReasoningAnalysis {
  intent: string
  sentiment: string
  missingInfo: string[]
  plan: string[]
  productQuery: string | null
  products: { name: string; price: number; slug: string }[]
}

interface AnalysisPayload {
  intent?: string
  sentiment?: string
  missingInfo?: string[]
  plan?: string[]
  productQuery?: string | null
}

// Extracts the most meaningful search terms from a user message.
function searchTerms(message: string): string {
  const stop = new Set([
    'je', 'tu', 'il', 'nous', 'vous', 'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du',
    'et', 'ou', 'pour', 'avec', 'sans', 'sur', 'dans', 'quel', 'quelle', 'quels', 'quelles',
    'est', 'ce', 'cette', 'mon', 'ma', 'mes', 'votre', 'vos', 'svp', 'stp', 'bonjour',
  ])
  const words = message
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w))
  return words.slice(0, 4).join(' ')
}

async function findProducts(query: string, limit = 3) {
  const q = query.trim()
  if (!q) return []
  const words = q.split(/\s+/).filter(Boolean)
  const products = await prisma.product.findMany({
    where: {
      OR: words.flatMap((w) => [
        { name: { contains: w } },
        { description: { contains: w } },
      ]),
    },
    select: { name: true, price: true, slug: true },
    take: limit,
  })
  return products
}

// Pass 1: analyse intent, sentiment and plan, and pick relevant catalog products.
export async function analyze(
  message: string,
  history: ChatTurn[],
  agentId: AgentId
): Promise<ReasoningAnalysis> {
  const agent = AGENTS[agentId]
  const analysisPrompt = `Tu es le raisonnement interne de l'agent "${agent.name}" (${agent.department}).
Analyse le dernier message utilisateur comme le ferait un expert humain, puis renvoie UNIQUEMENT un JSON valide:
{
  "intent": "intention principale en une phrase",
  "sentiment": "état émotionnel probable du client en un mot (neutre, pressé, inquiet, satisfait, frustré...)",
  "missingInfo": ["informations manquantes, max 3"],
  "plan": ["étapes de réponse, max 4"],
  "productQuery": "requête courte pour chercher dans le catalogue, ou null"
}
${toneInstruction(agentId)}`

  const result = await generateText(
    {
      messages: [
        { role: 'system', content: analysisPrompt },
        ...history.slice(-4),
        { role: 'user', content: message },
      ],
      temperature: 0.2,
      maxOutputTokens: 400,
      json: true,
      timeoutMs: 12000,
      circuitBreaker: false,
    },
    ''
  )

  const parsed = result.text ? extractJson<AnalysisPayload>(result.text) : null

  const analysis: ReasoningAnalysis = {
    intent: parsed?.intent || message.slice(0, 120),
    sentiment: parsed?.sentiment || 'neutre',
    missingInfo: Array.isArray(parsed?.missingInfo) ? parsed!.missingInfo!.slice(0, 3) : [],
    plan: Array.isArray(parsed?.plan) ? parsed!.plan!.slice(0, 4) : [],
    productQuery: parsed?.productQuery ?? null,
    products: [],
  }

  // Tool use: only query the DB when the model asked for it, or the agent
  // reasons about products.
  const query = analysis.productQuery || (agent.reasoning ? searchTerms(message) : '')
  if (query) {
    try {
      analysis.products = await findProducts(query)
    } catch (err) {
      console.error('Catalog lookup failed:', err)
    }
  }

  return analysis
}

export interface GenerateAgentReplyInput {
  agentId: AgentId
  message: string
  history: ChatTurn[]
  useReasoning?: boolean
  media?: InlineMedia[]
  fallback: string
}

export interface AgentReply {
  text: string
  provider: string
  model: string
  agentId: AgentId
  reasoning: ReasoningAnalysis | null
}

// Pass 2: final answer, grounded in the analysis and real products.
export async function generateAgentReply(input: GenerateAgentReplyInput): Promise<AgentReply> {
  const { agentId, message, history, media, fallback } = input
  const agent = AGENTS[agentId]
  const useReasoning = input.useReasoning ?? agent.reasoning

  let reasoning: ReasoningAnalysis | null = null
  let context = `\n\n${toneInstruction(agentId)}`

  if (useReasoning && !media?.length) {
    // Skip the analysis pass when an image is attached: a vision turn is
    // better answered directly, and the analysis model call would not see it.
    try {
      reasoning = await analyze(message, history, agentId)
      if (reasoning.products.length > 0) {
        context += `\nProduits réels du catalogue pertinents (utilise ces prix exacts, ne les invente pas):\n${reasoning.products
          .map((p) => `- ${p.name} — ${p.price.toFixed(2)}€`)
          .join('\n')}`
      }
      if (reasoning.intent) context += `\nIntention détectée: ${reasoning.intent}.`
      if (reasoning.sentiment && reasoning.sentiment !== 'neutre') {
        context += `\nÉtat émotionnel du client: ${reasoning.sentiment} — adapte ton ton en conséquence.`
      }
      if (reasoning.missingInfo.length > 0) {
        context += `\nSi c'est nécessaire pour bien répondre, demande: ${reasoning.missingInfo.join(' ; ')}.`
      }
    } catch (err) {
      console.error('Reasoning pass failed, continuing without it:', err)
    }
  }

  const systemPrompt = useReasoning
    ? `${agent.systemPrompt}\n\n${reasoningInstruction()}${context}`
    : `${agent.systemPrompt}${context}`

  const result = await generateText(
    {
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6),
        { role: 'user', content: message },
      ],
      media,
      temperature: agentId === 'support' || agentId === 'tracking' ? 0.4 : 0.7,
      maxOutputTokens: 900,
    },
    fallback
  )

  return { text: result.text, provider: result.provider, model: result.model, agentId, reasoning }
}
