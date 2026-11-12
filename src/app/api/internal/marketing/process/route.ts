// Scheduled worker target for the marketing automation.
//
// A cron automation (or an external scheduler) calls this endpoint to drain the
// publish queue: it generates the AI launch kit for products waiting on one and
// dispatches the prepared assets to each configured channel.
//
// Protected by a bearer token (MARKETING_CRON_TOKEN) so it can run without an
// admin session. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`, so that
// variable is honoured too, and the email relay token is the last fallback —
// one shared secret already present on both hosts is enough.
import { NextRequest, NextResponse } from 'next/server'
import { processQueue } from '@/lib/marketing/queue'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300

async function handle(request: NextRequest) {
  const expected =
    process.env.MARKETING_CRON_TOKEN || process.env.CRON_SECRET || process.env.EMAIL_RELAY_TOKEN
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '25', 10) || 25, 100)
  const summary = await processQueue(limit)
  return NextResponse.json({ ok: true, summary })
}

export async function POST(request: NextRequest) {
  return handle(request)
}

export async function GET(request: NextRequest) {
  return handle(request)
}
