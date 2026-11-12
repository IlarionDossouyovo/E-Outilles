// Reseller & affiliate management.
//
// A Partner is either a reseller (buys and resells) or an affiliate (refers
// buyers with a code). Each has a unique referral code; orders that arrive with
// ?ref=CODE (or the stored eoutilles.partner code) are attributed to it and
// earn a commission. Partners progress through tiers and can be assigned
// quests (objectives + rewards).

import { prisma } from '@/lib/db/prisma'
import { randomBytes } from 'crypto'

export type PartnerTier = 'bronze' | 'argent' | 'or' | 'platine'

// Tier thresholds by cumulative approved+paid commission (in EUR).
export const TIER_THRESHOLDS: { tier: PartnerTier; min: number; bonusPct: number }[] = [
  { tier: 'bronze', min: 0, bonusPct: 0 },
  { tier: 'argent', min: 500, bonusPct: 2 },
  { tier: 'or', min: 2000, bonusPct: 4 },
  { tier: 'platine', min: 6000, bonusPct: 7 },
]

// Default quest set handed to a new partner. Stored as JSON on the Partner row.
export const DEFAULT_QUESTS = [
  { id: 'first_sale', label: 'Première vente', target: 1, reward: 'Bonus de bienvenue 10 €' },
  { id: 'five_sales', label: '5 ventes', target: 5, reward: 'Commission +2 % pendant 30 jours' },
  { id: 'ten_sales', label: '10 ventes', target: 10, reward: 'Kit vitrine offert' },
  { id: 'recurring', label: 'Client fidèle', target: 1, reward: 'Prime de fidélité 25 €' },
]

export function generateReferralCode(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'PART'
  const suffix = randomBytes(2).toString('hex').toUpperCase()
  return `${base}${suffix}`
}

export function tierFor(totalCommission: number): PartnerTier {
  let tier: PartnerTier = 'bronze'
  for (const t of TIER_THRESHOLDS) if (totalCommission >= t.min) tier = t.tier
  return tier
}

export function tierBonus(tier: PartnerTier): number {
  return TIER_THRESHOLDS.find((t) => t.tier === tier)?.bonusPct ?? 0
}

// Creates (or reuses) a Partner from an approved reseller request.
export async function partnerFromResellerRequest(requestId: string): Promise<{ id: string; referralCode: string }> {
  const req = await prisma.resellerRequest.findUnique({ where: { id: requestId } })
  if (!req) throw new Error('Demande revendeur introuvable')

  const existing = await prisma.partner.findUnique({ where: { email: req.email } })
  if (existing) {
    await prisma.resellerRequest.update({ where: { id: requestId }, data: { status: 'approved' } })
    return { id: existing.id, referralCode: existing.referralCode }
  }

  let referralCode = generateReferralCode(req.company || req.name)
  // Guarantee uniqueness even if the base collides.
  for (let i = 0; i < 5; i++) {
    const clash = await prisma.partner.findUnique({ where: { referralCode } })
    if (!clash) break
    referralCode = generateReferralCode(req.company || req.name)
  }

  const partner = await prisma.partner.create({
    data: {
      type: 'reseller',
      name: req.name,
      company: req.company,
      email: req.email,
      phone: req.phone,
      city: req.city,
      country: null,
      referralCode,
      commissionPct: 10,
      status: 'active',
      quests: JSON.stringify(DEFAULT_QUESTS),
      tier: 'bronze',
    },
  })
  await prisma.resellerRequest.update({ where: { id: requestId }, data: { status: 'approved' } })
  return { id: partner.id, referralCode: partner.referralCode }
}

export async function findPartnerByCode(code: string) {
  if (!code) return null
  return prisma.partner.findUnique({ where: { referralCode: code.toUpperCase() } })
}

// Records a commission for an order attributed to a partner. Idempotent per
// orderId so a retried checkout never double-credits.
export async function recordReferral(input: {
  partnerId: string
  orderId?: string
  orderTotal: number
}): Promise<{ commission: number } | null> {
  const partner = await prisma.partner.findUnique({ where: { id: input.partnerId } })
  if (!partner || partner.status !== 'active') return null

  if (input.orderId) {
    const dupe = await prisma.partnerReferral.findFirst({ where: { partnerId: partner.id, orderId: input.orderId } })
    if (dupe) return { commission: dupe.commission }
  }

  const pct = partner.commissionPct + tierBonus(partner.tier as PartnerTier)
  const commission = Math.round((input.orderTotal * pct) / 100 * 100) / 100

  await prisma.partnerReferral.create({
    data: { partnerId: partner.id, orderId: input.orderId || null, orderTotal: input.orderTotal, commission, status: 'pending' },
  })

  await refreshTier(partner.id)
  return { commission }
}

// Recomputes a partner's tier from its approved+paid commissions.
export async function refreshTier(partnerId: string): Promise<PartnerTier> {
  const agg = await prisma.partnerReferral.aggregate({
    where: { partnerId, status: { in: ['approved', 'paid'] } },
    _sum: { commission: true },
  })
  const tier = tierFor(agg._sum.commission || 0)
  await prisma.partner.update({ where: { id: partnerId }, data: { tier } })
  return tier
}

export interface PartnerStats {
  totalReferrals: number
  pendingCommission: number
  approvedCommission: number
  paidCommission: number
  totalRevenue: number
  tier: PartnerTier
  quests: { id: string; label: string; target: number; reward: string; progress: number; done: boolean }[]
}

export async function partnerStats(partnerId: string): Promise<PartnerStats> {
  const partner = await prisma.partner.findUnique({ where: { id: partnerId } })
  if (!partner) throw new Error('Partenaire introuvable')
  const referrals = await prisma.partnerReferral.findMany({ where: { partnerId } })
  const sum = (statuses: string[]) =>
    Math.round(referrals.filter((r) => statuses.includes(r.status)).reduce((a, r) => a + r.commission, 0) * 100) / 100
  const revenue = Math.round(referrals.reduce((a, r) => a + r.orderTotal, 0) * 100) / 100

  let quests: PartnerStats['quests'] = []
  try {
    const raw = partner.quests ? JSON.parse(partner.quests) : DEFAULT_QUESTS
    const list = Array.isArray(raw) ? raw : DEFAULT_QUESTS
    quests = list.map((q: { id: string; label: string; target: number; reward: string }) => {
      const progress = Math.min(referrals.length, q.target)
      return { ...q, progress, done: progress >= q.target }
    })
  } catch {
    quests = []
  }

  return {
    totalReferrals: referrals.length,
    pendingCommission: sum(['pending']),
    approvedCommission: sum(['approved']),
    paidCommission: sum(['paid']),
    totalRevenue: revenue,
    tier: partner.tier as PartnerTier,
    quests,
  }
}

// Builds the shareable tracking URL for a partner on a given channel.
export function referralUrl(code: string, base: string, opts: { path?: string; channel?: string; campaign?: string } = {}): string {
  const url = new URL(opts.path || '/', base)
  url.searchParams.set('ref', code)
  url.searchParams.set('utm_source', opts.channel || 'affiliation')
  url.searchParams.set('utm_medium', 'referral')
  if (opts.campaign) url.searchParams.set('utm_campaign', opts.campaign)
  return url.toString()
}
