import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Stripe webhook handler for payment confirmation
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    // If Stripe is not configured, return success (mock mode)
    if (!process.env.STRIPE_SECRET_KEY || !signature) {
      console.log('Stripe not configured - webhook mock mode')
      return NextResponse.json({ received: true, mode: 'mock' })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Payment successful for session:', session.id)
        
        // TODO: Update order status in database
        // const orderId = session.metadata?.orderId
        // if (orderId) {
        //   await updateOrderStatus(orderId, 'paid')
        // }
        
        break
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
}
