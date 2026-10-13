// Marketing channel catalogue for E-Outilles.
//
// Two families of channels:
//  - "sales":   where money changes hands (marketplace, WhatsApp, POS...)
//  - "traffic": where visitors come from (social, ads, SEO, email...)
//
// This module is client-safe (no Prisma, no Node APIs): the admin dashboard
// and the public footer/header both import it. Per-channel editable values
// (URLs, handles) live in the persisted StoreSettings under `marketing`.

export type ChannelKind = 'sales' | 'traffic'

export interface ChannelDef {
  id: string
  name: string
  kind: ChannelKind
  // Placeholder shown in the admin form; the real value is stored in settings.
  example: string
  // Whether the channel needs a URL/handle configured to be usable.
  needsValue: boolean
  hint?: string
}

// Sales channels: places a customer can actually buy from.
export const SALES_CHANNELS: ChannelDef[] = [
  { id: 'site', name: 'Boutique en ligne', kind: 'sales', example: 'https://e-outilles.com', needsValue: false, hint: 'Le site principal (toujours actif)' },
  { id: 'whatsapp', name: 'WhatsApp Business', kind: 'sales', example: '+229 01 977 003 47', needsValue: true, hint: 'Commandes directes par messagerie' },
  { id: 'facebookShop', name: 'Facebook Shop', kind: 'sales', example: 'https://facebook.com/eoutilles/shop', needsValue: true },
  { id: 'instagramShop', name: 'Instagram Shopping', kind: 'sales', example: 'https://instagram.com/eoutilles', needsValue: true },
  { id: 'tiktokShop', name: 'TikTok Shop', kind: 'sales', example: 'https://tiktok.com/@eoutilles', needsValue: true },
  { id: 'marketplace', name: 'Marketplace (Jumia / Amazon)', kind: 'sales', example: 'https://jumia.bj/e-outilles', needsValue: true },
  { id: 'resellers', name: 'Réseau revendeurs', kind: 'sales', example: '/revendeurs', needsValue: false, hint: 'Vente via les partenaires' },
  { id: 'pos', name: 'Point de vente / Boutique physique', kind: 'sales', example: 'Cotonou, Bénin', needsValue: true },
]

// Traffic channels: where the audience is reached.
export const TRAFFIC_CHANNELS: ChannelDef[] = [
  { id: 'facebook', name: 'Facebook', kind: 'traffic', example: 'https://facebook.com/eoutilles', needsValue: true },
  { id: 'instagram', name: 'Instagram', kind: 'traffic', example: 'https://instagram.com/eoutilles', needsValue: true },
  { id: 'tiktok', name: 'TikTok', kind: 'traffic', example: 'https://tiktok.com/@eoutilles', needsValue: true },
  { id: 'youtube', name: 'YouTube', kind: 'traffic', example: 'https://youtube.com/@eoutilles', needsValue: true },
  { id: 'linkedin', name: 'LinkedIn', kind: 'traffic', example: 'https://linkedin.com/company/e-outilles', needsValue: true },
  { id: 'twitter', name: 'X / Twitter', kind: 'traffic', example: 'https://x.com/eoutilles', needsValue: true },
  { id: 'whatsappChannel', name: 'Canal WhatsApp', kind: 'traffic', example: 'https://whatsapp.com/channel/xxx', needsValue: true },
  { id: 'googleAds', name: 'Google Ads', kind: 'traffic', example: 'AW-XXXXXXXXX', needsValue: true },
  { id: 'metaAds', name: 'Meta Ads (Facebook/Instagram)', kind: 'traffic', example: 'Pixel ID', needsValue: true },
  { id: 'tiktokAds', name: 'TikTok Ads', kind: 'traffic', example: 'Pixel ID', needsValue: true },
  { id: 'email', name: 'Email / Newsletter', kind: 'traffic', example: '/admin/newsletter', needsValue: false, hint: 'Campagnes Resend' },
  { id: 'seo', name: 'SEO / Référencement naturel', kind: 'traffic', example: 'Google Search Console', needsValue: false },
  { id: 'affiliation', name: 'Affiliation / Influence', kind: 'traffic', example: 'Code partenaire', needsValue: true },
]

export const ALL_CHANNELS: ChannelDef[] = [...SALES_CHANNELS, ...TRAFFIC_CHANNELS]

export const CHANNEL_BY_ID: Record<string, ChannelDef> = Object.fromEntries(
  ALL_CHANNELS.map((c) => [c.id, c])
)

// UTM source -> channel id, so campaign links can be attributed to a channel.
export const UTM_SOURCES: Record<string, string> = {
  facebook: 'facebook',
  fb: 'facebook',
  instagram: 'instagram',
  ig: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  yt: 'youtube',
  linkedin: 'linkedin',
  twitter: 'twitter',
  x: 'twitter',
  google: 'googleAds',
  adwords: 'googleAds',
  newsletter: 'email',
  email: 'email',
  whatsapp: 'whatsapp',
}

// Standard UTM presets offered in the campaign builder.
export const UTM_MEDIUMS = ['social', 'cpc', 'email', 'organic', 'influencer', 'referral', 'display'] as const
export const UTM_CAMPAIGNS = ['lancement', 'promo', 'nouveautes', 'retargeting', 'soldes', 'fidelite'] as const

export interface CampaignInput {
  url: string
  source: string
  medium: string
  campaign: string
  content?: string
}

// Build a trackable campaign URL. `url` may be absolute or site-relative.
export function buildCampaignUrl({ url, source, medium, campaign, content }: CampaignInput): string {
  const base = url.trim() || '/'
  const sep = base.includes('?') ? '&' : '?'
  const params = new URLSearchParams()
  if (source) params.set('utm_source', source)
  if (medium) params.set('utm_medium', medium)
  if (campaign) params.set('utm_campaign', campaign)
  if (content) params.set('utm_content', content)
  const qs = params.toString()
  return qs ? `${base}${sep}${qs}` : base
}

export function resolveUtmChannel(source: string | null | undefined): string | null {
  if (!source) return null
  return UTM_SOURCES[source.trim().toLowerCase()] || null
}
