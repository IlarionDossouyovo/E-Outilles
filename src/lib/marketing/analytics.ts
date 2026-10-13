// Marketing analytics aggregation. Pure functions (no Prisma) so the shapes
// can be unit-reasoned about and reused client-side. The API route feeds them
// rows read from the database.

import {
  SALES_CHANNELS,
  TRAFFIC_CHANNELS,
  CHANNEL_BY_ID,
  resolveUtmChannel,
  type ChannelDef,
} from '@/lib/marketing/channels'
import type { MarketingSettings } from '@/lib/settings/defaults'

export interface TrafficVisitRow {
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
}

export interface OrderAttributionRow {
  utmSource: string | null
  utmCampaign: string | null
  total: number
}

export interface ChannelStat {
  id: string
  name: string
  kind: 'sales' | 'traffic'
  configured: boolean
  value: string
  visits: number
  orders: number
  revenue: number
  conversion: number
  hint?: string
}

export interface CampaignStat {
  campaign: string
  source: string | null
  visits: number
  orders: number
  revenue: number
  conversion: number
}

export interface MarketingAnalytics {
  generatedAt: string
  totals: {
    visits: number
    orders: number
    revenue: number
    conversion: number
    subscribers: number
    configuredChannels: number
    totalChannels: number
  }
  salesChannels: ChannelStat[]
  trafficChannels: ChannelStat[]
  campaigns: CampaignStat[]
}

function isConfigured(def: ChannelDef, value: string): boolean {
  if (!def.needsValue) return true
  return Boolean(value && value.trim())
}

function emptyStat(def: ChannelDef, value: string): ChannelStat {
  return {
    id: def.id,
    name: def.name,
    kind: def.kind,
    configured: isConfigured(def, value),
    value,
    visits: 0,
    orders: 0,
    revenue: 0,
    conversion: 0,
    hint: def.hint,
  }
}

// Attribute a visit row to a channel id. Falls back to the raw source so
// unmapped campaigns still show up, and to "direct" when there is none.
function visitChannel(row: TrafficVisitRow): string {
  const mapped = resolveUtmChannel(row.utmSource)
  if (mapped) return mapped
  if (row.utmSource) return `src:${row.utmSource.toLowerCase()}`
  return 'direct'
}

function orderChannel(row: OrderAttributionRow): string {
  const mapped = resolveUtmChannel(row.utmSource)
  if (mapped) return mapped
  if (row.utmSource) return `src:${row.utmSource.toLowerCase()}`
  return 'direct'
}

export function buildMarketingAnalytics(input: {
  marketing: MarketingSettings
  visits: TrafficVisitRow[]
  orders: OrderAttributionRow[]
  subscribers: number
}): MarketingAnalytics {
  const { marketing, visits, orders, subscribers } = input
  const channels = marketing.channels || {}

  const sales = SALES_CHANNELS.map((d) => emptyStat(d, channels[d.id] || ''))
  const traffic = TRAFFIC_CHANNELS.map((d) => emptyStat(d, channels[d.id] || ''))
  const salesById = new Map(sales.map((s) => [s.id, s]))
  const trafficById = new Map(traffic.map((t) => [t.id, t]))

  // Visits per channel (traffic side; "direct" and unmapped sources kept apart).
  const direct: ChannelStat = {
    id: 'direct', name: 'Accès direct / non attribué', kind: 'traffic',
    configured: true, value: '', visits: 0, orders: 0, revenue: 0, conversion: 0,
  }
  for (const v of visits) {
    const id = visitChannel(v)
    const stat = trafficById.get(id) || direct
    stat.visits += 1
  }

  // Orders + revenue per channel (sales side). An order attributed to a
  // traffic channel also credits that channel so both views are complete.
  const campaigns = new Map<string, CampaignStat>()
  for (const o of orders) {
    const id = orderChannel(o)
    const target = salesById.get(id) || trafficById.get(id) || direct
    target.orders += 1
    target.revenue += o.total

    const key = o.utmCampaign || '(sans campagne)'
    const existing = campaigns.get(key) || {
      campaign: key, source: o.utmSource, visits: 0, orders: 0, revenue: 0, conversion: 0,
    }
    existing.orders += 1
    existing.revenue += o.total
    campaigns.set(key, existing)
  }
  for (const v of visits) {
    const key = v.utmCampaign || '(sans campagne)'
    const existing = campaigns.get(key) || {
      campaign: key, source: v.utmSource, visits: 0, orders: 0, revenue: 0, conversion: 0,
    }
    existing.visits += 1
    campaigns.set(key, existing)
  }

  const finalize = (s: ChannelStat) => {
    s.conversion = s.visits > 0 ? s.orders / s.visits : 0
  }
  ;[...sales, ...traffic, direct].forEach(finalize)

  const campaignList = Array.from(campaigns.values()).map((c) => ({
    ...c,
    conversion: c.visits > 0 ? c.orders / c.visits : 0,
  })).sort((a, b) => b.revenue - a.revenue || b.visits - a.visits)

  const totalVisits = visits.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((n, o) => n + o.total, 0)
  const allStats = [...sales, ...traffic]
  const configuredChannels = allStats.filter((s) => s.configured).length

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      visits: totalVisits,
      orders: totalOrders,
      revenue: totalRevenue,
      conversion: totalVisits > 0 ? totalOrders / totalVisits : 0,
      subscribers,
      configuredChannels,
      totalChannels: allStats.length,
    },
    salesChannels: sales,
    trafficChannels: [...traffic, direct],
    campaigns: campaignList,
  }
}

export function channelName(id: string): string {
  return CHANNEL_BY_ID[id]?.name || id
}
