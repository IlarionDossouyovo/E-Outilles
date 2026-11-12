// Drains the marketing publish queue. Admin-triggered from /admin/marketing.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { processQueue } from '@/lib/marketing/queue'

export const maxDuration = 300

export async function POST() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  const summary = await processQueue(25)
  return NextResponse.json({ ok: true, summary })
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  const summary = await processQueue(25)
  return NextResponse.json({ ok: true, summary })
}
