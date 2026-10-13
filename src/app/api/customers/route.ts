import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAdmin } from '@/lib/security/auth'

// Admin-only customer directory. Never returns password or reset tokens.
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        createdAt: true,
        orders: { select: { total: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = customers.map((c) => {
      const active = c.orders.filter((o) => o.status !== 'cancelled')
      return {
        id: c.id,
        name: c.name || 'Client',
        email: c.email,
        phone: c.phone,
        city: c.city,
        country: c.country,
        createdAt: c.createdAt,
        orderCount: c.orders.length,
        totalSpent: Math.round(active.reduce((sum, o) => sum + (o.total || 0), 0) * 100) / 100,
      }
    })

    return NextResponse.json({ customers: result, total: result.length })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
