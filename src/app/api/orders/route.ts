// API Orders - E-Outilles
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { getSession } from '@/lib/security/auth'
import { sendOrderConfirmation } from '@/lib/email/sendEmail'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session = await getSession()

  try {
    const where: Record<string, unknown> = {}
    const isAdmin = session?.role === 'admin'

    // Non-admins can only read their own orders
    if (!isAdmin) {
      if (!session) {
        return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
      }
      where.userId = session.id
    } else {
      const userId = searchParams.get('userId')
      const status = searchParams.get('status')
      if (userId) where.userId = userId
      if (status) where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      items,
      shippingAddress,
      shippingCity,
      shippingCountry,
      paymentMethod,
      notes,
      customerName,
      customerEmail,
      phone,
    } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const session = await getSession()

    // Resolve the customer: signed-in user, or find/create a guest account by email
    let user = session ? await prisma.user.findUnique({ where: { id: session.id } }) : null

    if (!user) {
      const email = String(customerEmail || '').trim().toLowerCase()
      if (!email) {
        return NextResponse.json({ error: 'Email requis pour commander' }, { status: 400 })
      }
      user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: customerName || null,
            phone: phone || null,
            password: await bcrypt.hash(crypto.randomUUID(), 10),
            role: 'customer',
          },
        })
      }
    }

    // Recompute the total from database prices (never trust client totals)
    const productIds = items
      .map((i: { productId?: string; id?: string }) => i.productId || i.id)
      .filter((id: string | undefined): id is string => Boolean(id))
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const priceById = new Map(products.map((p) => [p.id, p.price]))

    const orderItems = items
      .map((i: { productId?: string; id?: string; quantity: number }) => {
        const productId = i.productId || i.id
        const price = priceById.get(productId as string)
        if (!productId || price === undefined) return null
        return { productId, quantity: Math.max(1, Number(i.quantity) || 1), price }
      })
      .filter(Boolean) as { productId: string; quantity: number; price: number }[]

    if (orderItems.length === 0) {
      return NextResponse.json({ error: 'Aucun produit valide dans la commande' }, { status: 400 })
    }

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        shippingAddress,
        shippingCity,
        shippingCountry,
        paymentMethod,
        notes,
        status: 'pending',
        items: { create: orderItems }
      },
      include: { items: { include: { product: true } } }
    })

    // Best-effort confirmation email; never block or fail the order on email errors
    sendOrderConfirmation({
      id: order.id,
      customerEmail: user.email,
      customerName: user.name || 'Client',
      total: order.total,
      items: order.items.map((i) => ({
        name: i.product?.name || 'Produit',
        quantity: i.quantity,
        price: i.price,
      })),
    }).catch((err) => console.error('Order confirmation email failed:', err))

    return NextResponse.json({ orderId: order.id, order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
