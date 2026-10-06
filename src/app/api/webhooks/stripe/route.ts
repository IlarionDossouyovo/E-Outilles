import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { isStripeWebhookConfigured } from '@/lib/payments/config'

// Stripe webhook handler for payment confirmation
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // If Stripe is not configured, return success (mock mode)
    if (!isStripeWebhookConfigured() || !signature) {
      console.log('Stripe not configured - webhook mock mode')
      return NextResponse.json({ received: true, mode: 'mock' })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = session.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'paid',
              paymentId: (session.payment_intent as string | null) || null,
              paymentMethod: 'card',
            },
          })
          console.log('Order marked as paid:', orderId)
        } else {
          console.log('Payment successful (no orderId in metadata):', session.id)
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        await prisma.order.updateMany({
          where: { paymentId: paymentIntent.id, status: { not: 'paid' } },
          data: { status: 'paid' },
        })
        console.log('PaymentIntent succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const orderId = session.metadata?.orderId
        if (orderId) {
          await prisma.order.updateMany({
            where: { id: orderId, status: 'pending' },
            data: { status: 'cancelled' },
          })
          console.log('Order cancelled after session expiry:', orderId)
        }
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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
