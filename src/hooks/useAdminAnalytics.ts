'use client'

import { useEffect, useState } from 'react'
import type { AdminAnalyticsData } from '@/components/AdminAnalytics'

interface RawOrderItem {
  quantity?: number
  price?: number
  product?: { name?: string | null } | null
}

interface RawOrder {
  id: string
  total: number
  status: string
  createdAt: string
  user?: { name?: string | null; email?: string } | null
  items?: RawOrderItem[]
}

const EMPTY: AdminAnalyticsData = {
  totalOrders: 0,
  totalRevenue: 0,
  activeProducts: 0,
  subscribers: 0,
  recentOrders: [],
  topProducts: [],
}

// Derives the admin dashboard metrics from the real orders/products/subscribers
// APIs so the header cards never show fabricated numbers.
export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsData>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      const [ordersRes, productsRes, subsRes] = await Promise.all([
        fetch('/api/orders').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/products').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/newsletter').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ])

      if (!active) return

      const orders: RawOrder[] = Array.isArray(ordersRes) ? ordersRes : []
      const products = Array.isArray(productsRes) ? productsRes : []
      const subscribers = Array.isArray(subsRes) ? subsRes : []

      const salesByProduct = new Map<string, { sales: number; revenue: number }>()
      for (const order of orders) {
        for (const item of order.items || []) {
          const name = item.product?.name
          if (!name) continue
          const qty = item.quantity || 1
          const current = salesByProduct.get(name) || { sales: 0, revenue: 0 }
          current.sales += qty
          current.revenue += (item.price || 0) * qty
          salesByProduct.set(name, current)
        }
      }

      const topProducts = Array.from(salesByProduct.entries())
        .map(([name, v]) => ({ name, sales: v.sales, revenue: Math.round(v.revenue * 100) / 100 }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setData({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        activeProducts: products.length,
        subscribers: subscribers.length,
        recentOrders: orders.slice(0, 5).map((o) => ({
          id: o.id,
          customer: o.user?.name || 'Client',
          amount: o.total,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
        })),
        topProducts,
      })
      setLoading(false)
    }

    load().catch(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return { data, loading }
}
