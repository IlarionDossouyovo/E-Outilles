'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  date: string
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'en attente', color: 'bg-yellow-500' },
  processing: { label: 'traitement', color: 'bg-blue-500' },
  paid: { label: 'payé', color: 'bg-green-600' },
  shipped: { label: 'expédié', color: 'bg-purple-500' },
  delivered: { label: 'livré', color: 'bg-green-500' },
  cancelled: { label: 'annulé', color: 'bg-red-500' }
}

function statusInfo(status: string) {
  return statusLabels[status] || { label: status, color: 'bg-gray-500' }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeProducts: 0, subscribers: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/products?limit=1000').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/newsletter').then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([ordersData, productsData, subsData]) => {
      const orders = Array.isArray(ordersData) ? ordersData : []
      const products = Array.isArray(productsData) ? productsData : (productsData.products || [])
      const subs = Array.isArray(subsData) ? subsData : []

      const revenue = orders
        .filter((o: { status: string }) => o.status !== 'cancelled')
        .reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0)

      setStats({
        totalOrders: orders.length,
        totalRevenue: Math.round(revenue * 100) / 100,
        activeProducts: products.length,
        subscribers: subs.length,
      })

      setRecentOrders(orders.slice(0, 5).map((o: {
        id: string; total: number; status: string; createdAt: string
        user?: { name?: string | null } | null
      }) => ({
        id: o.id,
        customer: o.user?.name || 'Client',
        amount: o.total,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
      })))

      const salesByProduct: Record<string, { name: string; sales: number; revenue: number }> = {}
      orders.forEach((o: { items?: { quantity: number; price: number; product?: { name?: string } | null }[] }) => {
        (o.items || []).forEach((item) => {
          const name = item.product?.name || 'Produit'
          if (!salesByProduct[name]) salesByProduct[name] = { name, sales: 0, revenue: 0 }
          salesByProduct[name].sales += item.quantity
          salesByProduct[name].revenue += item.quantity * item.price
        })
      })
      setTopProducts(Object.values(salesByProduct).sort((a, b) => b.sales - a.sales).slice(0, 5))
    })
  }, [])

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-ingco-yellow">Dashboard</Link>
            <Link href="/admin/products" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
            <Link href="/admin/add-product" className="text-gray-300 hover:text-ingco-yellow">Ajouter</Link>
            <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow">Messages</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Icon name="user" className="w-4 h-4" /> Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Retour Accueil
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="text-gray-400 hover:text-ingco-yellow text-sm">Agents IA</Link>
            <span className="text-gray-600">|</span>
            <Link href="/" className="text-gray-400 hover:text-ingco-yellow text-sm">Accueil</Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-gray-400">Gestion de votre boutique E-Outilles</p>
        </div>

        {/* Analytics */}
        <AdminAnalytics data={{
          totalOrders: stats.totalOrders,
          totalRevenue: stats.totalRevenue,
          activeProducts: stats.activeProducts,
          subscribers: stats.subscribers,
          recentOrders: recentOrders,
          topProducts: topProducts
        }} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Commandes totales</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="truck" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-green-500 text-sm mt-1">+12% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Chiffre d'affaires</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="card" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-ingco-yellow">{stats.totalRevenue.toLocaleString()}€</div>
            <div className="text-green-500 text-sm mt-1">+8% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Produits actifs</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="tools" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeProducts}</div>
            <div className="text-gray-500 text-sm mt-1">5 nouveaux ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Newsletter Abonnés</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center"><Icon name="chat" className="w-5 h-5 text-ingco-yellow" /></span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.subscribers.toLocaleString()}</div>
            <div className="text-green-500 text-sm mt-1">+156 ce mois</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Commandes récentes</h2>
              <Link href="/admin/orders" className="text-ingco-yellow text-sm hover:underline">Voir tout</Link>
            </div>
            
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                  <div>
                    <div className="text-white font-medium">{order.customer}</div>
                    <div className="text-gray-500 text-sm">{order.id} • {order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{order.amount.toLocaleString()}€</div>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${statusInfo(order.status).color}`}>
                      {statusInfo(order.status).label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Produits les plus vendus</h2>
              <Link href="/admin/products" className="text-ingco-yellow text-sm hover:underline">Voir tout</Link>
            </div>
            
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-ingco-yellow/20 rounded-lg flex items-center justify-center text-ingco-yellow font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-gray-500 text-sm">{product.sales} ventes</div>
                    </div>
                  </div>
                  <div className="text-ingco-yellow font-bold">{product.revenue.toLocaleString()}€</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link href="/admin/add-product" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <Icon name="grid" className="w-6 h-6 text-ingco-yellow mx-auto mb-2" />
            <span className="text-white text-sm">Ajouter produit</span>
          </Link>
          <Link href="/admin/orders" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <Icon name="truck" className="w-6 h-6 text-ingco-yellow mx-auto mb-2" />
            <span className="text-white text-sm">Gérer commandes</span>
          </Link>
          <Link href="/admin/newsletter" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <Icon name="chat" className="w-6 h-6 text-ingco-yellow mx-auto mb-2" />
            <span className="text-white text-sm">Newsletter</span>
          </Link>
          <Link href="/agent" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <Icon name="user" className="w-6 h-6 text-ingco-yellow mx-auto mb-2" />
            <span className="text-white text-sm">Agents IA</span>
          </Link>
          <Link href="/admin/settings" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <Icon name="settings" className="w-6 h-6 text-ingco-yellow mx-auto mb-2" />
            <span className="text-white text-sm">Paramètres</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-dark border-t border-ingco-gray py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 E-Outilles Admin. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
