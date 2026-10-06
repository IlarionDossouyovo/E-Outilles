import { NextRequest, NextResponse } from 'next/server'
import { isStripeConfigured } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'eur' } = await request.json()
    
    // Only create payment intent if Stripe is configured
    if (!isStripeConfigured()) {
      // Return mock response for development
      return NextResponse.json({ 
        clientSecret: 'mock_client_secret_for_development',
        message: 'Stripe not configured - using mock mode'
      })
    }
    
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    
    const amountInCents = Math.round(amount * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Stripe payment intent error:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
