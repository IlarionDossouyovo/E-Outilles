// Records a payout (commission payment) to a partner and marks the covered
// referrals as paid.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'
import { partnerStats, refreshTier } from '@/lib/marketing/partners'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  let body: { amount?: number; method?: string; reference?: string } = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const partner = await prisma.partner.findUnique({ where: { id: params.id } })
  if (!partner) return NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 })

  const stats = await partnerStats(partner.id)
  const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : stats.approvedCommission
  if (amount <= 0) {
    return NextResponse.json({ error: 'Aucune commission à payer' }, { status: 400 })
  }

  const payout = await prisma.partnerPayout.create({
    data: {
      partnerId: partner.id,
      amount,
      method: body.method || 'mobile_money',
      status: 'paid',
      reference: body.reference || null,
      paidAt: new Date(),
    },
  })

  // Mark approved referrals as paid (up to the paid amount, oldest first).
  let remaining = amount
  const approved = await prisma.partnerReferral.findMany({
    where: { partnerId: partner.id, status: 'approved' },
    orderBy: { createdAt: 'asc' },
  })
  for (const r of approved) {
    if (remaining < r.commission) break
    await prisma.partnerReferral.update({ where: { id: r.id }, data: { status: 'paid' } })
    remaining = Math.round((remaining - r.commission) * 100) / 100
  }

  await refreshTier(partner.id)
  return NextResponse.json({ ok: true, payout, stats: await partnerStats(partner.id) })
}
