// Reasoning layer: two-pass generation for reasoning-capable agents.
// Pass 1 analyses the request and, when useful, selects real catalog products.
// Pass 2 produces the final answer grounded in that analysis.

import { prisma } from '@/lib/db/prisma'
import { generateText, extractJson, type ChatTurn } from './provider'
import { AGENTS, reasoningInstruction, type AgentId } from './agents'

export interface ReasoningAnalysis {
  intent: string
  missingInfo: string[]
  plan: string[]
  productQuery: string | null
  products: { name: string; price: number; slug: string }[]
}

interface AnalysisPayload {
  intent?: string
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

// Pass 1: analyse intent and pick relevant catalog products.
export async function analyze(
  message: string,
  history: ChatTurn[],
  agentId: AgentId
): Promise<ReasoningAnalysis> {
  const agent = AGENTS[agentId]
  const analysisPrompt = `Tu es un moteur d'analyse pour l'agent "${agent.name}".
Analyse le dernier message utilisateur et renvoie UNIQUEMENT un JSON valide:
{
  "intent": "intention principale en une phrase",
  "missingInfo": ["informations manquantes, max 3"],
  "plan": ["étapes de réponse, max 4"],
  "productQuery": "requête courte pour chercher dans le catalogue, ou null"
}`

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
    },
    ''
  )

  const parsed = result.text ? extractJson<AnalysisPayload>(result.text) : null

  const analysis: ReasoningAnalysis = {
    intent: parsed?.intent || message.slice(0, 120),
    missingInfo: Array.isArray(parsed?.missingInfo) ? parsed!.missingInfo!.slice(0, 3) : [],
    plan: Array.isArray(parsed?.plan) ? parsed!.plan!.slice(0, 4) : [],
    productQuery: parsed?.productQuery ?? null,
    products: [],
  }

  // Tool use: only query the DB when the agent reasons and the model asked for it.
  const query = analysis.productQuery || (agent.reasoning ? searchTerms(message) : '')
  if (query) {
    analysis.products = await findProducts(query)
  }

  return analysis
}

export interface GenerateAgentReplyInput {
  agentId: AgentId
  message: string
  history: ChatTurn[]
  useReasoning?: boolean
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
  const { agentId, message, history, fallback } = input
  const agent = AGENTS[agentId]
  const useReasoning = input.useReasoning ?? agent.reasoning

  let reasoning: ReasoningAnalysis | null = null
  let catalogContext = ''

  if (useReasoning) {
    try {
      reasoning = await analyze(message, history, agentId)
      if (reasoning.products.length > 0) {
        catalogContext = `\nProduits réels du catalogue pertinents (utilise ces prix exacts, ne les invente pas):\n${reasoning.products
          .map((p) => `- ${p.name} — ${p.price.toFixed(2)}€`)
          .join('\n')}`
      }
      if (reasoning.intent) {
        catalogContext += `\nIntention détectée: ${reasoning.intent}.`
      }
    } catch (err) {
      console.error('Reasoning pass failed, continuing without it:', err)
    }
  }

  const systemPrompt = useReasoning
    ? `${agent.systemPrompt}\n\n${reasoningInstruction()}${catalogContext}`
    : `${agent.systemPrompt}${catalogContext}`

  const result = await generateText(
    {
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6),
        { role: 'user', content: message },
      ],
      temperature: agentId === 'support' || agentId === 'tracking' ? 0.4 : 0.7,
      maxOutputTokens: 900,
    },
    fallback
  )

  return { text: result.text, provider: result.provider, model: result.model, agentId, reasoning }
}
