import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/security/auth'
import { getSettings, saveSettings } from '@/lib/settings/store'
import { isGoogleAIConfigured, isOllamaConfigured } from '@/lib/ai/provider'
import { isStripeConfigured, isStripeWebhookConfigured } from '@/lib/payments/config'

// Admin-only store settings + live integration status.
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const settings = await getSettings()
  const resendKey = process.env.RESEND_API_KEY
  const resendConfigured = Boolean(resendKey?.startsWith('re_') && resendKey !== 're_placeholder_key')

  return NextResponse.json({
    settings,
    integrations: {
      googleAI: isGoogleAIConfigured(),
      ollama: isOllamaConfigured(),
      resend: resendConfigured,
      stripe: isStripeConfigured(),
      stripeWebhook: isStripeWebhookConfigured(),
    },
  })
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const settings = await saveSettings(body)
  return NextResponse.json({ ok: true, settings })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
