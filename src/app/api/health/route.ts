import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { isGoogleAIConfigured, isOllamaConfigured, isOllamaReachable, GOOGLE_AI_MODEL } from '@/lib/ai/provider'
import { isStripeConfigured, isStripeWebhookConfigured } from '@/lib/payments/config'

// Diagnostics: reports which integrations are wired up without leaking secrets.
// `configured` only tells whether a usable value is present, never its content.
export const dynamic = 'force-dynamic'

export async function GET() {
  let database = 'ok'
  let productCount: number | null = null
  try {
    productCount = await prisma.product.count()
  } catch {
    database = 'error'
  }

  const resendKey = process.env.RESEND_API_KEY
  const agentCode = process.env.AGENT_ACCESS_CODE
  const resendConfigured = Boolean(resendKey?.startsWith('re_') && resendKey !== 're_placeholder_key')

  return NextResponse.json({
    status: database === 'ok' ? 'ok' : 'degraded',
    database,
    productCount,
    ai: {
      google: { configured: isGoogleAIConfigured(), model: GOOGLE_AI_MODEL },
      ollama: { configured: isOllamaConfigured(), reachable: await isOllamaReachable() },
      fallback: 'demo',
    },
    email: {
      resend: { configured: resendConfigured },
      from: process.env.FROM_EMAIL || 'E-Outilles <noreply@eoutilles.com>',
    },
    stripe: {
      configured: isStripeConfigured(),
      webhookConfigured: isStripeWebhookConfigured(),
    },
    agent: { accessCodeConfigured: Boolean(agentCode && agentCode.length >= 8) },
  })
}
