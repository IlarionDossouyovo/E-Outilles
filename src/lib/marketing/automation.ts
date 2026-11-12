// AI marketing automation: turn a product (its image + attributes) into a full
// multi-locale, multi-channel launch kit and queue it for publishing.
//
// Triggered automatically when a product is created or updated with an image,
// or on demand from /admin/marketing. Everything it produces is stored as
// ProductAsset rows (description, social posts, video script, SEO) plus one
// PublishJob per configured sales/traffic channel.

import { prisma } from '@/lib/db/prisma'
import { generateText, extractJson, type InlineMedia } from '@/lib/ai/provider'
import { LOCALE_CODES, type Locale } from '@/lib/i18n/config'
import { SALES_CHANNELS, TRAFFIC_CHANNELS, CHANNEL_BY_ID } from '@/lib/marketing/channels'
import { parseImages } from '@/lib/images'
import { readFile } from 'fs/promises'
import { join } from 'path'

export interface KitLocaleContent {
  description: string
  features: string[]
  seoTitle: string
  seoKeywords: string[]
}

export interface KitChannelContent {
  channel: string
  caption: string
  hashtags: string[]
  cta: string
}

export interface KitPayload {
  locales: Record<string, KitLocaleContent>
  channels: KitChannelContent[]
  videoScript: string
}

// Per-channel writing guidance: length, tone and what makes the post work there.
const CHANNEL_BRIEF: Record<string, string> = {
  facebook: 'Publication Facebook: 2-3 phrases accrocheuses + bénéfice concret + appel à l\'action. Émojis sobres.',
  instagram: 'Légende Instagram: court, inspirant, 1 phrase d\'accroche, 1 bénéfice, 5-8 hashtags pertinents.',
  tiktok: 'Script TikTok court (15-30 s): hook en 3 s, démonstration, bénéfice, CTA "lien en bio".',
  whatsapp: 'Message WhatsApp Business: direct, professionnel, prix et disponibilité, invitation à commander.',
  whatsappChannel: 'Annonce Canal WhatsApp: nouveauté, prix, disponibilité, lien boutique.',
  linkedin: 'Post LinkedIn: angle professionnel/B2B, valeur métier, ton expert, 3-4 hashtags.',
  twitter: 'Post X/Twitter: 1 accroche percutante en moins de 240 caractères + 2 hashtags.',
  youtube: 'Description YouTube: résumé de la vidéo démo + chapitres + liens.',
  email: 'Email marketing: objet + corps court, bénéfices, prix, bouton d\'action.',
  marketplace: 'Fiche marketplace (Jumia/Amazon): titre optimisé + puces techniques + description vendeur.',
  facebookShop: 'Fiche Facebook Shop: titre + description produit + points clés.',
  instagramShop: 'Fiche Instagram Shopping: description produit concise.',
  tiktokShop: 'Fiche TikTok Shop: titre accrocheur + description + bénéfices.',
  resellers: 'Kit revendeur: argumentaire de vente, marge conseillée, cible client.',
  pos: 'Argumentaire point de vente: présentation orale courte pour le vendeur.',
  site: 'Description boutique en ligne: complète, structurée, optimisée SEO.',
  seo: 'Mots-clés SEO et balises pour la page produit.',
}

const VIDEO_BRIEF =
  'Script vidéo de 30 secondes: plan 1 (hook), plan 2 (présentation produit), plan 3 (démonstration/usage), plan 4 (bénéfices), plan 5 (prix + CTA). Format: liste de plans avec durée et texte à l\'écran.'

const IMAGE_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
}

// Loads the product's first image as inline media for the vision model. Only
// raster images stored under /public can be read directly; SVGs (the catalog
// default) and remote URLs are skipped, and the kit then relies on text alone.
async function loadImageMedia(images: string | null): Promise<InlineMedia | null> {
  const first = parseImages(images)[0]
  if (!first || !first.startsWith('/')) return null
  const ext = first.split('.').pop()?.toLowerCase() || ''
  const mimeType = IMAGE_MIME[ext]
  if (!mimeType) return null
  try {
    const buf = await readFile(join(process.cwd(), 'public', first.replace(/^\//, '')))
    if (buf.byteLength > 6 * 1024 * 1024) return null
    return { mimeType, data: buf.toString('base64') }
  } catch {
    return null
  }
}

// One vision pass: describes what is actually visible on the product image so
// every locale's copy stays grounded in the real product, not just its name.
async function describeImage(media: InlineMedia): Promise<string> {
  try {
    const res = await generateText(
      {
        messages: [
          {
            role: 'user',
            content:
              'Décris précisément ce que tu vois sur cette photo de produit d\'outillage professionnel: type d\'outil, matériaux, couleur, éléments visibles (moteur, batterie, accessoires, emballage), et usage typique. 4 phrases maximum, factuel.',
          },
        ],
        media: [media],
        temperature: 0.3,
        maxOutputTokens: 400,
        circuitBreaker: false,
      },
      ''
    )
    return res.text.trim()
  } catch {
    return ''
  }
}

function buildPrompt(input: {
  name: string
  category: string
  price: number
  comparePrice?: number | null
  features: string[]
  currentDescription?: string | null
  visual?: string
  locale: Locale
  channels: string[]
}) {
  const channelLines = input.channels
    .map((c) => `- ${c}: ${CHANNEL_BRIEF[c] || 'Publication adaptée au canal.'}`)
    .join('\n')
  return `Tu es le responsable marketing d'E-Outilles, spécialiste de l'outillage professionnel INGCO (marchés Afrique de l'Ouest, Europe, Amérique latine).

Produit:
- Nom: ${input.name}
- Catégorie: ${input.category}
- Prix: ${input.price} EUR${input.comparePrice ? ` (au lieu de ${input.comparePrice} EUR)` : ''}
- Caractéristiques connues: ${input.features.length ? input.features.join(' | ') : 'non renseignées'}
${input.currentDescription ? `- Description actuelle: ${input.currentDescription}` : ''}
${input.visual ? `- Analyse de la photo produit (fiable, appuie-toi dessus): ${input.visual}` : ''}

Langue de rédaction: ${input.locale} (rédige TOUT dans cette langue).

Produis un kit marketing complet et véridique (n'invente aucune caractéristique technique qui ne figure pas ci-dessus; reste crédible pour de l'outillage professionnel).

Canaux à couvrir:
${channelLines}

Réponds STRICTEMENT en JSON valide, sans texte autour:
{
  "description": "description produit complète de 3 à 5 paragraphes, professionnelle",
  "features": ["5 à 7 puces de bénéfices/arguments"],
  "seoTitle": "titre SEO de moins de 60 caractères",
  "seoKeywords": ["6 à 10 mots-clés"],
  "channels": [{"channel": "id_du_canal", "caption": "texte prêt à publier", "hashtags": ["..."], "cta": "appel à l'action"}],
  "videoScript": "${VIDEO_BRIEF}"
}`
}

// AI call for one locale. Returns null when the provider is unavailable so the
// caller can fall back to a deterministic template instead of failing the run.
async function generateLocaleKit(input: {
  name: string
  category: string
  price: number
  comparePrice?: number | null
  features: string[]
  currentDescription?: string | null
  visual?: string
  locale: Locale
  channels: string[]
}): Promise<{ locales: Record<string, KitLocaleContent>; channels: KitChannelContent[]; videoScript: string } | null> {
  const res = await generateText(
    {
      messages: [{ role: 'user', content: buildPrompt(input) }],
      json: true,
      temperature: 0.6,
      maxOutputTokens: 2600,
      circuitBreaker: false,
    },
    ''
  )
  if (!res.text) return null
  const parsed = extractJson<{
    description?: string
    features?: string[]
    seoTitle?: string
    seoKeywords?: string[]
    channels?: { channel?: string; caption?: string; hashtags?: string[]; cta?: string }[]
    videoScript?: string
  }>(res.text)
  if (!parsed) return null
  const channels: KitChannelContent[] = (parsed.channels || [])
    .filter((c) => c && typeof c.caption === 'string' && c.caption.trim())
    .map((c) => ({
      channel: String(c.channel || '').trim(),
      caption: String(c.caption).trim(),
      hashtags: Array.isArray(c.hashtags) ? c.hashtags.map(String).slice(0, 12) : [],
      cta: String(c.cta || '').trim(),
    }))
  return {
    locales: {
      [input.locale]: {
        description: String(parsed.description || '').trim(),
        features: Array.isArray(parsed.features) ? parsed.features.map(String).slice(0, 8) : [],
        seoTitle: String(parsed.seoTitle || '').trim(),
        seoKeywords: Array.isArray(parsed.seoKeywords) ? parsed.seoKeywords.map(String).slice(0, 12) : [],
      },
    },
    channels,
    videoScript: String(parsed.videoScript || '').trim(),
  }
}

// Deterministic fallback so a product still gets a coherent kit when the AI
// provider is down: builds a description and per-channel captions from the raw
// product data. No invented technical claims.
function fallbackKit(input: {
  name: string
  category: string
  price: number
  features: string[]
  visual?: string
  locale: Locale
  channels: string[]
}): { locales: Record<string, KitLocaleContent>; channels: KitChannelContent[]; videoScript: string } {
  const featureText = input.features.length ? input.features.join(', ') : input.category
  const desc: Record<Locale, string> = {
    fr: `${input.name} — outillage professionnel de la gamme ${input.category}, conçu pour les artisans et les chantiers exigeants. Caractéristiques: ${featureText}. Disponible au prix de ${input.price} EUR, livraison mondiale.`,
    en: `${input.name} — professional tool from the ${input.category} range, built for demanding craftsmen and worksites. Features: ${featureText}. Available at ${input.price} EUR, worldwide shipping.`,
    es: `${input.name} — herramienta profesional de la gama ${input.category}, pensada para artesanos y obras exigentes. Características: ${featureText}. Disponible por ${input.price} EUR, envío mundial.`,
    pt: `${input.name} — ferramenta profissional da linha ${input.category}, feita para artesãos e obras exigentes. Características: ${featureText}. Disponível por ${input.price} EUR, envio mundial.`,
  }
  const cta: Record<Locale, string> = {
    fr: 'Commandez maintenant sur E-Outilles.',
    en: 'Order now on E-Outilles.',
    es: 'Pide ahora en E-Outilles.',
    pt: 'Peça agora na E-Outilles.',
  }
  const channels: KitChannelContent[] = input.channels.map((c) => ({
    channel: c,
    caption: `${input.name} — ${input.category} • ${input.price} EUR. ${cta[input.locale]}`,
    hashtags: ['#EOutilles', '#Outillage', '#INGCO'],
    cta: cta[input.locale],
  }))
  return {
    locales: {
      [input.locale]: {
        description: desc[input.locale],
        features: input.features.slice(0, 6),
        seoTitle: `${input.name} | E-Outilles`,
        seoKeywords: [input.name, input.category, 'outillage professionnel'],
      },
    },
    channels,
    videoScript: '',
  }
}

export interface AutomateResult {
  productId: string
  locales: string[]
  assetsCreated: number
  jobsQueued: number
  channels: string[]
  provider: 'ai' | 'fallback'
}

// Generates the full kit for a product and queues publication on every
// configured channel. Idempotent per locale+kind+channel: existing draft/ready
// assets are refreshed instead of duplicated.
export async function automateProduct(input: {
  productId: string
  locales?: Locale[]
  channels?: string[]
  regenerate?: boolean
}): Promise<AutomateResult> {
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    include: { category: true },
  })
  if (!product) throw new Error('Produit introuvable')

  const locales = (input.locales?.length ? input.locales : (LOCALE_CODES as Locale[]))
  const features = (() => {
    try {
      const v = product.features ? JSON.parse(product.features) : []
      return Array.isArray(v) ? v.map(String) : []
    } catch {
      return []
    }
  })()

  // Channels to prepare: explicit request, else every configured channel plus
  // the always-on storefront and reseller network.
  const configured = await configuredChannelIds()
  const channels = (input.channels?.length ? input.channels : configured).filter((c) =>
    Boolean(CHANNEL_BY_ID[c])
  )
  const allChannels = Array.from(new Set(['site', ...channels]))

  // Vision pass: ground the copy in the real photo when it is a raster image.
  const media = await loadImageMedia(product.images)
  const visual = media ? await describeImage(media) : ''

  const base = {
    name: product.name,
    category: product.category?.name || product.categoryId,
    price: product.price,
    comparePrice: product.comparePrice,
    features,
    currentDescription: product.description,
    visual,
  }

  let assetsCreated = 0
  let jobsQueued = 0
  let usedAi = false

  for (const locale of locales) {
    let kit: { locales: Record<string, KitLocaleContent>; channels: KitChannelContent[]; videoScript: string } | null = null
    try {
      kit = await generateLocaleKit({ ...base, locale, channels: allChannels })
    } catch (err) {
      console.error('automateProduct: AI kit failed', locale, err)
    }
    if (kit) usedAi = true
    else kit = fallbackKit({ ...base, locale, channels: allChannels })

    const content = kit.locales[locale]
    if (content?.description) {
      await upsertAsset(product.id, { kind: 'description', channel: null, locale }, {
        title: `${product.name} — description`,
        body: content.description,
        meta: JSON.stringify({ features: content.features, seoTitle: content.seoTitle, seoKeywords: content.seoKeywords }),
      })
      assetsCreated++
    }

    for (const ch of kit.channels) {
      if (!ch.channel || !ch.caption) continue
      await upsertAsset(product.id, { kind: 'social_post', channel: ch.channel, locale }, {
        title: `${product.name} — ${ch.channel}`,
        body: ch.caption,
        meta: JSON.stringify({ hashtags: ch.hashtags, cta: ch.cta }),
      })
      assetsCreated++
    }

    if (kit.videoScript) {
      await upsertAsset(product.id, { kind: 'script', channel: null, locale }, {
        title: `${product.name} — script vidéo`,
        body: kit.videoScript,
      })
      assetsCreated++
    }
  }

  // Enrich the product itself when its description is empty.
  if (!product.description) {
    const fr = await prisma.productAsset.findFirst({
      where: { productId: product.id, kind: 'description', locale: 'fr' },
      orderBy: { createdAt: 'desc' },
    })
    if (fr?.body) {
      await prisma.product.update({ where: { id: product.id }, data: { description: fr.body } })
    }
  }

  // Queue one publish job per channel (skip duplicates already queued/running).
  for (const channel of allChannels) {
    const existing = await prisma.publishJob.findFirst({
      where: { productId: product.id, channel, status: { in: ['queued', 'running'] } },
    })
    if (existing) continue
    await prisma.publishJob.create({
      data: {
        productId: product.id,
        channel,
        action: 'publish',
        status: 'queued',
        payload: JSON.stringify({ productId: product.id, name: product.name, locales }),
      },
    })
    jobsQueued++
  }

  return {
    productId: product.id,
    locales,
    assetsCreated,
    jobsQueued,
    channels: allChannels,
    provider: usedAi ? 'ai' : 'fallback',
  }
}

// Refreshes an asset in place when it already exists for the same
// product/kind/channel/locale, so re-running the automation is idempotent.
async function upsertAsset(
  productId: string,
  key: { kind: string; channel: string | null; locale: string },
  data: { title?: string; body?: string; mediaUrl?: string | null; meta?: string | null }
) {
  const existing = await prisma.productAsset.findFirst({
    where: { productId, kind: key.kind, channel: key.channel, locale: key.locale },
  })
  if (existing) {
    await prisma.productAsset.update({
      where: { id: existing.id },
      data: { ...data, status: 'ready' },
    })
    return existing.id
  }
  const created = await prisma.productAsset.create({
    data: { productId, kind: key.kind, channel: key.channel, locale: key.locale, status: 'ready', ...data },
  })
  return created.id
}

// Channel ids that have a value configured in StoreSettings.marketing.channels.
export async function configuredChannelIds(): Promise<string[]> {
  const row = await prisma.setting.findUnique({ where: { key: 'store' } })
  if (!row?.value) return ['site', 'resellers']
  try {
    const parsed = JSON.parse(row.value) as { marketing?: { channels?: Record<string, string> } }
    const map = parsed.marketing?.channels || {}
    const ids = Object.entries(map)
      .filter(([, v]) => typeof v === 'string' && v.trim())
      .map(([k]) => k)
    return Array.from(new Set(['site', 'resellers', ...ids])).filter((c) => Boolean(CHANNEL_BY_ID[c]))
  } catch {
    return ['site', 'resellers']
  }
}

export const ALL_CHANNEL_DEFS = [...SALES_CHANNELS, ...TRAFFIC_CHANNELS]

// First product image, used as the visual attached to social posts.
export function productImage(product: { images: string }): string | null {
  const imgs = parseImages(product.images)
  return imgs[0] || null
}
