// Server-safe Stripe configuration check (no client-only imports).
const PLACEHOLDER_MARKERS = ['placeholder', 'votre', 'your_', 'xxx']

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || !key.startsWith('sk_')) return false
  const lower = key.toLowerCase()
  return !PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))
}

export function isStripeWebhookConfigured(): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  return isStripeConfigured() && Boolean(secret && secret.startsWith('whsec_') && !secret.toLowerCase().includes('votre'))
}
