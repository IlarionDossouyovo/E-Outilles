import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Records an attributed page view. Public (no auth): the client beacon calls
// it once per page with the UTM parameters it saw. Each hit is stored so the
// dashboard can trend by channel and campaign.
const MAX = 120

function clean(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, MAX) : null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const path = clean(body.path) || '/'
    const utmSource = clean(body.utmSource)
    const utmMedium = clean(body.utmMedium)
    const utmCampaign = clean(body.utmCampaign)
    const utmContent = clean(body.utmContent)
    const referrer = clean(body.referrer)

    // Skip noise: only store hits that carry attribution or an external referrer.
    if (!utmSource && !utmMedium && !utmCampaign && !referrer) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    await prisma.trafficEvent.create({
      data: { path, utmSource, utmMedium, utmCampaign, utmContent, referrer },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Traffic track error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
