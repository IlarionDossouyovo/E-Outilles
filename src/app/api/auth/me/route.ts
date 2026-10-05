import { NextResponse } from 'next/server'
import { getSession } from '@/lib/security/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, name: true, role: true, country: true, phone: true, city: true, address: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      user,
      orders: orders.map((o) => ({
        id: o.id,
        date: o.createdAt,
        total: o.total,
        status: o.status,
        items: o.items.length,
        products: o.items.map((i) => i.product?.name).filter(Boolean),
      })),
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
