import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/security/auth'
import { isStripeConfigured } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
  try {
    const { orderId, priceId, quantity = 1, customerEmail } = await request.json()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'

    // Stripe is optional: without a key the checkout stays in offline mode
    // (order recorded as pending, no online payment step).
    if (!isStripeConfigured()) {
      return NextResponse.json({ mock: true, message: 'Stripe not configured - offline mode' })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    let lineItems: Record<string, unknown>[] | undefined
    let metadata: Record<string, string> = {}

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      })
      if (!order) {
        return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
      }

      // Only the order owner (or an admin) may pay for it.
      const session = await getSession()
      const isOwner = session?.id === order.userId
      const isAdmin = session?.role === 'admin'
      if (!session || (!isOwner && !isAdmin)) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
      }

      lineItems = order.items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.product?.name || 'Produit E-Outilles' },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }))

      metadata = { orderId: order.id }
    } else if (priceId) {
      lineItems = [{ price: priceId, quantity }]
    } else {
      return NextResponse.json({ error: 'orderId ou priceId requis' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems as never,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?payment=cancelled`,
      customer_email: customerEmail || undefined,
      metadata,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
