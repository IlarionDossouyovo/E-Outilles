// Converts an approved reseller request into an active Partner with its own
// referral code, commission rate and quest set.
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { partnerFromResellerRequest } from '@/lib/marketing/partners'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  let body: { requestId?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }
  if (!body.requestId) return NextResponse.json({ error: 'requestId requis' }, { status: 400 })

  try {
    const partner = await partnerFromResellerRequest(body.requestId)
    return NextResponse.json({ ok: true, partner })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
