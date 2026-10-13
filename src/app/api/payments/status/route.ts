import { NextResponse } from 'next/server'
import { isStripeConfigured } from '@/lib/payments/config'

// Public, non-sensitive capability flag: tells the checkout page whether card
// payment can be offered. The secret key itself never leaves the server.
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ card: isStripeConfigured() })
}
