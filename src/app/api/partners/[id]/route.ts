// Admin actions on a single partner: read details, update status/commission,
// approve pending commissions.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'
import { partnerStats, refreshTier } from '@/lib/marketing/partners'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const partner = await prisma.partner.findUnique({ where: { id: params.id } })
  if (!partner) return NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 })

  const [referrals, payouts, stats] = await Promise.all([
    prisma.partnerReferral.findMany({ where: { partnerId: partner.id }, orderBy: { createdAt: 'desc' } }),
    prisma.partnerPayout.findMany({ where: { partnerId: partner.id }, orderBy: { createdAt: 'desc' } }),
    partnerStats(partner.id),
  ])
  return NextResponse.json({ partner, referrals, payouts, stats })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  let body: {
    status?: string
    commissionPct?: number
    discountPct?: number
    action?: 'approve_commissions'
  } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const partner = await prisma.partner.findUnique({ where: { id: params.id } })
  if (!partner) return NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 })

  if (body.action === 'approve_commissions') {
    await prisma.partnerReferral.updateMany({
      where: { partnerId: partner.id, status: 'pending' },
      data: { status: 'approved' },
    })
    await refreshTier(partner.id)
    return NextResponse.json({ ok: true, stats: await partnerStats(partner.id) })
  }

  const updated = await prisma.partner.update({
    where: { id: partner.id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(typeof body.commissionPct === 'number' ? { commissionPct: body.commissionPct } : {}),
      ...(typeof body.discountPct === 'number' ? { discountPct: body.discountPct } : {}),
    },
  })
  return NextResponse.json(updated)
}
