import { NextRequest, NextResponse } from 'next/server'
import { generateAgentReply } from '@/lib/ai/reasoning'
import { AGENTS, PUBLIC_AGENT_IDS, isAgentId, routeToAgent, agentSupportsVision, type AgentId } from '@/lib/ai/agents'
import type { ChatTurn, InlineMedia } from '@/lib/ai/provider'
import { getSession } from '@/lib/security/auth'
import { isFounderEmail } from '@/lib/security/founder'
import { isLocale, type Locale } from '@/lib/i18n/config'
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

// Deterministic offline responder so the assistant always answers with a
// coherent, human-sounding reply, even when no AI provider is configured.
// Answers are topic-aware (delivery, payment, warranty...) and department-aware
// (each agent has its own opening), and end with a helpful next step.
const TOPICS: { match: RegExp; answer: string }[] = [
  {
    match: /(livrais|délai|delai|expédi|expedi|colis|quand.*recev|48h)/i,
    answer:
      "Côté livraison, c'est simple : elle est gratuite à Cotonou, comptez environ 48h dans les grandes villes du Bénin, et un peu plus en zone rurale. Vous recevez un suivi par WhatsApp à chaque étape.",
  },
  {
    match: /(paiement|payer|mobile money|mtn|moov|orange|stripe|carte|espèces|especes)/i,
    answer:
      "Vous pouvez payer par carte bancaire (Stripe, sécurisé), par Mobile Money (MTN, Moov, Orange) ou en espèces à la livraison. Dites-moi votre préférence et je vous indique la marche à suivre.",
  },
  {
    match: /(garantie|sav|panne|réparation|reparation|pièce|piece)/i,
    answer:
      "Tous nos outils sont garantis 1 an minimum, pièces de rechange incluses. En cas de panne, on prend en charge le SAV : envoyez-nous une photo du problème et je vous guide pour la suite.",
  },
  {
    match: /(retour|rembours|échange|echange|satisfait)/i,
    answer:
      "Vous disposez de 30 jours pour changer d'avis : retour ou échange possible si le produit est dans son état d'origine. Je peux lancer la démarche avec vous si vous me donnez le numéro de commande.",
  },
  {
    match: /(perceuse|perforateur|percer|béton|beton|marteau)/i,
    answer:
      "Pour percer du béton, je recommande la Perceuse visseuse INGCO 20V (89,99€) pour les travaux courants, ou le Marteau perforateur SDS Max 1500W (249,99€) si vous percez souvent du béton armé. Le second est plus puissant et plus durable sur chantier.",
  },
  {
    match: /(meuleuse|disque|ponceuse|scie|tronçonneuse|tronconneuse)/i,
    answer:
      "Nous avons des meuleuses, scies et tronçonneuses professionnelles INGCO. Pour bien vous orienter : quel matériau travaillez-vous (métal, bois, béton) et à quelle fréquence ? Je vous proposerai le modèle le plus adapté.",
  },
  {
    match: /(prix|tarif|devis|remise|promo|budget|coût|cout|cher)/i,
    answer:
      "Nos prix sont déjà alignés sur le prix fabricant, et des remises s'appliquent sur les commandes en gros. Indiquez-moi les quantités souhaitées et je vous prépare une estimation.",
  },
  {
    match: /(bonjour|salut|bonsoir|hello|hi|ça va|ca va)/i,
    answer:
      "Bonjour et bienvenue chez E-Outilles ! Dites-moi ce que vous recherchez (un outil précis, un budget, un type de chantier) et je vous oriente tout de suite.",
  },
]

const DEPARTMENT_INTRO: Record<AgentId, string> = {
  assistant: "Je suis votre assistant E-Outilles.",
  sales: "Je vous accompagne pour choisir et commander au meilleur prix.",
  support: "Je suis là pour résoudre votre souci rapidement.",
  tracking: "Je vous aide à suivre votre commande.",
  catalog: "Je connais la gamme INGCO par cœur.",
  sourcing: "Côté approvisionnement, voici ce que je peux vous dire.",
  project: "Pour organiser ça proprement, voici comment je vois les choses.",
  analytics: "Regardons les chiffres ensemble.",
  marketing: "Voici comment je formulerais ça pour convaincre.",
  hr: "Côté RH, voici mon conseil.",
  finance: "Sur le plan financier, voici l'essentiel.",
  legal: "Sur le plan juridique, voici les points à retenir.",
}

// Localised openings / closings for the offline responder so it stays coherent
// with the auto-translated UI. Internal (founder-only) agents keep the French
// wording — the founder works in French.
const DEMO_CLOSING: Record<string, string> = {
  fr: "Posez-moi votre question sur nos produits, la livraison, le paiement ou la garantie — je vous réponds concrètement.",
  en: "Ask me about our products, delivery, payment or warranty — I'll give you a concrete answer.",
  es: "Pregúntame por nuestros productos, la entrega, el pago o la garantía — te respondo con concreción.",
  pt: "Pergunte-me sobre os produtos, a entrega, o pagamento ou a garantia — respondo-lhe de forma concreta.",
}

const PUBLIC_INTRO: Record<string, Partial<Record<AgentId, string>>> = {
  fr: {
    assistant: "Je suis votre assistant E-Outilles.",
    sales: "Je vous accompagne pour choisir et commander au meilleur prix.",
    support: "Je suis là pour résoudre votre souci rapidement.",
    tracking: "Je vous aide à suivre votre commande.",
    catalog: "Je connais la gamme INGCO par cœur.",
  },
  en: {
    assistant: "I am your E-Outilles assistant.",
    sales: "I help you choose and order at the best price.",
    support: "I am here to solve your issue quickly.",
    tracking: "I help you track your order.",
    catalog: "I know the INGCO range by heart.",
  },
  es: {
    assistant: "Soy tu asistente de E-Outilles.",
    sales: "Te acompaño para elegir y pedir al mejor precio.",
    support: "Estoy aquí para resolver tu problema rápidamente.",
    tracking: "Te ayudo a seguir tu pedido.",
    catalog: "Conozco la gama INGCO de memoria.",
  },
  pt: {
    assistant: "Sou o seu assistente E-Outilles.",
    sales: "Acompanho-o a escolher e encomendar ao melhor preço.",
    support: "Estou aqui para resolver o seu problema rapidamente.",
    tracking: "Ajudo-o a acompanhar a sua encomenda.",
    catalog: "Conheço a gama INGCO de cor.",
  },
}

const CHAT_ERROR: Record<string, string> = {
  fr: "Désolé, une erreur est survenue. Réessayez dans un instant.",
  en: "Sorry, something went wrong. Please try again in a moment.",
  es: "Lo sentimos, ha ocurrido un error. Inténtelo de nuevo en un momento.",
  pt: "Lamentamos, ocorreu um erro. Tente novamente dentro de instantes.",
}

function demoIntro(agentId: AgentId, locale: string): string {
  return PUBLIC_INTRO[locale]?.[agentId] || DEPARTMENT_INTRO[agentId]
}

function getDemoResponse(message: string, agentId: AgentId, locale: string = 'fr'): string {
  const agent = AGENTS[agentId]
  const intro = demoIntro(agentId, locale)
  const closing = DEMO_CLOSING[locale] || DEMO_CLOSING.fr
  // Topic answers exist in French only; use them for French, otherwise fall
  // back to the localised generic reply so the language stays coherent.
  if (locale === 'fr') {
    const topic = TOPICS.find((t) => t.match.test(message))
    if (topic) return topic.answer
  }
  return `${intro} ${agent.name} (${agent.department}). ${closing}`
}

interface MediaErrors {
  tooMany: string
  format: string
  empty: string
  tooBig: string
  messageRequired: string
}

const MEDIA_ERRORS: Record<string, MediaErrors> = {
  fr: {
    tooMany: 'Maximum 3 pièces jointes par message.',
    format: 'Format non pris en charge (images PNG/JPG/WEBP ou PDF).',
    empty: 'Pièce jointe vide.',
    tooBig: 'Pièce jointe trop volumineuse (max 6 Mo).',
    messageRequired: 'Message requis',
  },
  en: {
    tooMany: 'Maximum 3 attachments per message.',
    format: 'Unsupported format (PNG/JPG/WEBP images or PDF).',
    empty: 'Empty attachment.',
    tooBig: 'Attachment too large (max 6 MB).',
    messageRequired: 'Message required',
  },
  es: {
    tooMany: 'Máximo 3 archivos adjuntos por mensaje.',
    format: 'Formato no admitido (imágenes PNG/JPG/WEBP o PDF).',
    empty: 'Archivo adjunto vacío.',
    tooBig: 'Archivo adjunto demasiado grande (máx. 6 MB).',
    messageRequired: 'Mensaje obligatorio',
  },
  pt: {
    tooMany: 'Máximo de 3 anexos por mensagem.',
    format: 'Formato não suportado (imagens PNG/JPG/WEBP ou PDF).',
    empty: 'Anexo vazio.',
    tooBig: 'Anexo demasiado grande (máx. 6 MB).',
    messageRequired: 'Mensagem obrigatória',
  },
}

// Parses and validates an optional media array (images / PDF documents).
function parseMedia(raw: unknown, err: MediaErrors): { media: InlineMedia[]; error?: string } {
  if (!Array.isArray(raw) || raw.length === 0) return { media: [] }
  if (raw.length > 3) return { media: [], error: err.tooMany }

  const media: InlineMedia[] = []
  for (const item of raw) {
    const mimeType = String(item?.mimeType || '')
    const data = String(item?.data || '')
    if (!ALLOWED_MEDIA.test(mimeType)) {
      return { media: [], error: err.format }
    }
    if (!data) return { media: [], error: err.empty }
    // Approximate decoded size from the base64 length.
    if ((data.length * 3) / 4 > MAX_MEDIA_BYTES) {
      return { media: [], error: err.tooBig }
    }
    media.push({ mimeType, data })
  }
  return { media }
}

export async function POST(request: NextRequest) {
  let locale: Locale = 'fr'
  try {
    const body = await request.json()
    const message: string = (body?.message || '').toString().trim()
    locale = isLocale(body?.locale) ? body.locale : 'fr'

    const errors = MEDIA_ERRORS[locale] || MEDIA_ERRORS.fr
    const { media, error: mediaError } = parseMedia(body?.media, errors)
    if (mediaError) {
      return NextResponse.json({ error: mediaError }, { status: 400 })
    }
    // A message may be empty only when a file is attached.
    if (!message && media.length === 0) {
      return NextResponse.json({ error: errors.messageRequired }, { status: 400 })
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
      fallback: getDemoResponse(effectiveMessage, agentId, locale),
      locale,
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
    return NextResponse.json({ response: CHAT_ERROR[locale] }, { status: 200 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
