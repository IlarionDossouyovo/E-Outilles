// Admin management of reseller/affiliate partners.
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'
import { generateReferralCode, partnerStats, DEFAULT_QUESTS } from '@/lib/marketing/partners'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (type) where.type = type
  if (status) where.status = status

  const partners = await prisma.partner.findMany({ where, orderBy: { createdAt: 'desc' } })
  const withStats = await Promise.all(
    partners.map(async (p) => ({ ...p, stats: await partnerStats(p.id) }))
  )
  return NextResponse.json(withStats)
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  let body: {
    type?: string
    name?: string
    company?: string
    email?: string
    phone?: string
    country?: string
    city?: string
    commissionPct?: number
    discountPct?: number
  } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'name et email requis' }, { status: 400 })
  }

  const existing = await prisma.partner.findUnique({ where: { email: body.email } })
  if (existing) return NextResponse.json({ error: 'Ce partenaire existe déjà' }, { status: 409 })

  let referralCode = generateReferralCode(body.company || body.name)
  for (let i = 0; i < 5; i++) {
    if (!(await prisma.partner.findUnique({ where: { referralCode } }))) break
    referralCode = generateReferralCode(body.company || body.name)
  }

  const partner = await prisma.partner.create({
    data: {
      type: body.type === 'affiliate' ? 'affiliate' : 'reseller',
      name: body.name,
      company: body.company || null,
      email: body.email,
      phone: body.phone || null,
      country: body.country || null,
      city: body.city || null,
      referralCode,
      commissionPct: typeof body.commissionPct === 'number' ? body.commissionPct : 10,
      discountPct: typeof body.discountPct === 'number' ? body.discountPct : 0,
      status: 'active',
      quests: JSON.stringify(DEFAULT_QUESTS),
      tier: 'bronze',
    },
  })
  return NextResponse.json(partner, { status: 201 })
}
