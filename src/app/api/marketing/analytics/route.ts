import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { prisma } from '@/lib/db/prisma'
import { getSettings } from '@/lib/settings/store'
import { buildMarketingAnalytics } from '@/lib/marketing/analytics'

// Admin-only marketing analytics: channel configuration + attributed traffic
// and orders over the requested window (default 30 days).
export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const days = Math.min(Math.max(Number(searchParams.get('days')) || 30, 1), 365)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  try {
    const [settings, visits, orders, subscribers] = await Promise.all([
      getSettings(),
      prisma.trafficEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { utmSource: true, utmMedium: true, utmCampaign: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { utmSource: true, utmCampaign: true, total: true },
      }),
      prisma.subscriber.count(),
    ])

    const analytics = buildMarketingAnalytics({
      marketing: settings.marketing,
      visits,
      orders,
      subscribers,
    })

    return NextResponse.json({ ...analytics, windowDays: days })
  } catch (error) {
    console.error('Marketing analytics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
