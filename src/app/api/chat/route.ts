import { NextRequest, NextResponse } from 'next/server'
import { generateAgentReply } from '@/lib/ai/reasoning'
import { AGENTS, routeToAgent, type AgentId } from '@/lib/ai/agents'
import type { ChatTurn } from '@/lib/ai/provider'

// Deterministic offline responder so the assistant always answers.
const demoResponses: Record<string, string> = {
  perceuse: 'Nous avons plusieurs perceuses professionnelles. La Perceuse visseuse INGCO 20V à 89.99€ est notre bestseller : puissante, endurante et parfaite pour les travaux courants.',
  marteau: 'Notre marteau perforateur SDS Max 18V à 289.99€ est idéal pour percer le béton, avec un moteur brushless performant.',
  prix: 'Nos prix sont compétitifs et incluent la livraison au Bénin. Pour les gros achats, nous proposons des remises : contactez-nous pour un devis.',
  livraison: 'Nous livrons dans tout le Bénin : gratuite à Cotonou, 48h dans les grandes villes, avec suivi par WhatsApp.',
  garantie: 'Tous nos outils sont garantis 1 an minimum. Nous assurons le SAV et les pièces de rechange.',
  contact: 'Contactez-nous par WhatsApp au +229 01 977 003 47 ou par email à contact@e-outilles.com.',
}

function getDemoResponse(message: string, agentId: AgentId): string {
  const lower = message.toLowerCase()
  for (const [keyword, response] of Object.entries(demoResponses)) {
    if (lower.includes(keyword)) return response
  }
  const agent = AGENTS[agentId]
  return `Bonjour ! Je suis ${agent.name} d'E-Outilles. ${agent.description}. Posez-moi votre question sur nos produits, prix, livraison ou garantie.`
}

function isValidAgent(value: unknown): value is AgentId {
  return typeof value === 'string' && value in AGENTS
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message: string = (body?.message || '').toString().trim()
    if (!message) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const requestedAgent = isValidAgent(body?.agentId) ? body.agentId : null
    const agentId: AgentId = requestedAgent || routeToAgent(message)
    const useReasoning = typeof body?.reasoning === 'boolean' ? body.reasoning : undefined

    const history: ChatTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter((m: { role?: string; content?: string }) =>
            (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
          .slice(-6)
          .map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content }))
      : []

    const reply = await generateAgentReply({
      agentId,
      message,
      history,
      useReasoning,
      fallback: getDemoResponse(message, agentId),
    })

    return NextResponse.json({
      response: reply.text,
      agentId: reply.agentId,
      provider: reply.provider,
      model: reply.model,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { response: "Désolé, une erreur est survenue. Réessayez dans un instant." },
      { status: 200 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
