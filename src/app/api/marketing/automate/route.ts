// Admin endpoint to drive the marketing automation manually: generate a
// product's AI launch kit and/or drain the publish queue.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { enqueueProductKit, processQueue } from '@/lib/marketing/queue'
import { automateProduct } from '@/lib/marketing/automation'
import type { Locale } from '@/lib/i18n/config'
import { LOCALE_CODES, isLocale } from '@/lib/i18n/config'

export const maxDuration = 300

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  let body: {
    action?: 'generate' | 'process'
    productId?: string
    locales?: string[]
    channels?: string[]
    sync?: boolean
  } = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const action = body.action || 'generate'
  const locales = (body.locales || []).filter(isLocale) as Locale[]

  if (action === 'process') {
    const summary = await processQueue(25)
    return NextResponse.json({ ok: true, action, summary })
  }

  if (!body.productId) {
    return NextResponse.json({ error: 'productId requis' }, { status: 400 })
  }

  // Synchronous generation (awaits the AI). Handy from the admin dashboard.
  if (body.sync) {
    try {
      const result = await automateProduct({
        productId: body.productId,
        locales: locales.length ? locales : (LOCALE_CODES as Locale[]),
        channels: body.channels,
      })
      return NextResponse.json({ ok: true, action: 'generate', result })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  const jobId = await enqueueProductKit(body.productId, {
    locales: locales.length ? locales : undefined,
    channels: body.channels,
  })
  return NextResponse.json({ ok: true, action: 'queued', jobId }, { status: 202 })
}
