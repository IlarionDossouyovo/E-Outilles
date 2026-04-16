import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, quantity = 1, customerEmail } = await request.json()

    // Only use Stripe if configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Return mock response for development
      return NextResponse.json({ 
        sessionId: 'mock_session_for_development',
        url: '/success?mock=true',
        message: 'Stripe not configured - using mock mode'
      })
    }
    
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: [{ price: priceId, quantity }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
      customer_email: customerEmail,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
