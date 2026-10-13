import { NextRequest, NextResponse } from 'next/server'
import { generateAgentReply } from '@/lib/ai/reasoning'
import { AGENTS, PUBLIC_AGENT_IDS, isAgentId, routeToAgent, agentSupportsVision, type AgentId } from '@/lib/ai/agents'
import type { ChatTurn, InlineMedia } from '@/lib/ai/provider'
import { getSession } from '@/lib/security/auth'
import { isFounderEmail } from '@/lib/security/founder'
import { prisma } from '@/lib/db/prisma'
import {
  resolveIdentity,
  attachGuestCookie,
  ownerWhere,
  appendMessage,
  ensureTitle,
} from '@/lib/ai/conversations'

// Max attachment size (base64 payload) and allowed media types.
const MAX_MEDIA_BYTES = 6 * 1024 * 1024
const ALLOWED_MEDIA = /^(image\/(png|jpe?g|webp|gif|heic|heif)|application\/pdf)$/i

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

// Parses and validates an optional media array (images / PDF documents).
function parseMedia(raw: unknown): { media: InlineMedia[]; error?: string } {
  if (!Array.isArray(raw) || raw.length === 0) return { media: [] }
  if (raw.length > 3) return { media: [], error: 'Maximum 3 pièces jointes par message.' }

  const media: InlineMedia[] = []
  for (const item of raw) {
    const mimeType = String(item?.mimeType || '')
    const data = String(item?.data || '')
    if (!ALLOWED_MEDIA.test(mimeType)) {
      return { media: [], error: 'Format non pris en charge (images PNG/JPG/WEBP ou PDF).' }
    }
    if (!data) return { media: [], error: 'Pièce jointe vide.' }
    // Approximate decoded size from the base64 length.
    if ((data.length * 3) / 4 > MAX_MEDIA_BYTES) {
      return { media: [], error: 'Pièce jointe trop volumineuse (max 6 Mo).' }
    }
    media.push({ mimeType, data })
  }
  return { media }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message: string = (body?.message || '').toString().trim()

    const { media, error: mediaError } = parseMedia(body?.media)
    if (mediaError) {
      return NextResponse.json({ error: mediaError }, { status: 400 })
    }
    // A message may be empty only when a file is attached.
    if (!message && media.length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 })
    }

    const requestedAgent = isAgentId(body?.agentId) ? body.agentId : null
    const agentId: AgentId = requestedAgent || routeToAgent(message)

    // Internal (non-public) agents are founder-only.
    if (!PUBLIC_AGENT_IDS.includes(agentId)) {
      const session = await getSession()
      if (!session || !isFounderEmail(session.email)) {
        return NextResponse.json(
          { error: "Cet agent interne est réservé au fondateur de l'entreprise." },
          { status: 403 }
        )
      }
    }

    if (media.length > 0 && !agentSupportsVision(agentId)) {
      return NextResponse.json(
        { error: `${AGENTS[agentId].name} ne prend pas en charge l'analyse d'image.` },
        { status: 400 }
      )
    }

    const useReasoning = typeof body?.reasoning === 'boolean' ? body.reasoning : undefined

    const history: ChatTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter((m: { role?: string; content?: string }) =>
            (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
          .slice(-6)
          .map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content }))
      : []

    // Give the model a sensible default prompt when only a file is sent.
    const effectiveMessage =
      message || "Analyse ce document/photo et décris ce que tu observes, puis réponds à ma demande."

    // Resolve (or create) the conversation this turn belongs to.
    const { userId, guestId, isNewGuest } = await resolveIdentity(request)
    const requestedConversationId = typeof body?.conversationId === 'string' ? body.conversationId : null

    let conversation = requestedConversationId
      ? await prisma.aiConversation.findFirst({
          where: { id: requestedConversationId, ...ownerWhere(userId, guestId) },
        })
      : null

    if (!conversation) {
      conversation = await prisma.aiConversation.create({
        data: { userId, guestId, agentId, title: null },
      })
    } else if (conversation.agentId !== agentId) {
      conversation = await prisma.aiConversation.update({
        where: { id: conversation.id },
        data: { agentId },
      })
    }

    // Store the user turn before generating, so history is never lost.
    await appendMessage(conversation.id, {
      role: 'user',
      content: effectiveMessage,
      agentId,
      hasAttachment: media.length > 0,
      attachmentName: media.length > 0 ? String(body?.attachmentName || '').slice(0, 120) || null : null,
    })
    await ensureTitle(conversation.id, message || effectiveMessage)

    const reply = await generateAgentReply({
      agentId,
      message: effectiveMessage,
      history,
      useReasoning,
      media,
      fallback: getDemoResponse(effectiveMessage, agentId),
    })

    // Persist the assistant reply.
    await appendMessage(conversation.id, {
      role: 'assistant',
      content: reply.text,
      agentId: reply.agentId,
      provider: reply.provider,
    })

    const response = NextResponse.json({
      response: reply.text,
      agentId: reply.agentId,
      provider: reply.provider,
      model: reply.model,
      conversationId: conversation.id,
    })
    return isNewGuest ? attachGuestCookie(response, guestId) : response
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
