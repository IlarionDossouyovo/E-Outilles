'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface VendorOrder {
  id: string
  customer: string
  product: string
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
  pending: { label: 'En attente', color: 'bg-yellow-500' },
  processing: { label: 'En traitement', color: 'bg-blue-500' },
  paid: { label: 'Payé', color: 'bg-green-600' },
  shipped: { label: 'Expédié', color: 'bg-purple-500' },
  delivered: { label: 'Livré', color: 'bg-green-500' },
  cancelled: { label: 'Annulé', color: 'bg-red-500' }
}

function statusInfo(status: string) {
  return statusLabels[status] || { label: status, color: 'bg-gray-500' }
}

const quickActions = [
  { icon: '📦', title: 'Gestion Stocks', desc: 'Voir et modifier les produits', link: '/admin/products' },
  { icon: '📊', title: 'Rapports', desc: 'Voir les statistiques', link: '/admin/orders' },
  { icon: '👥', title: 'Clients', desc: 'Gérer les clients', link: '/profile' },
  { icon: '💬', title: 'Messages', desc: 'Voir les messages', link: '/chat' },
  { icon: '📚', title: 'Formations', desc: 'Accéder aux formations', link: '/formations' },
  { icon: '📁', title: 'Documents', desc: 'Catalogue et guides', link: '/formations' },
]

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [vendorStats, setVendorStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageRating: 0,
    thisMonth: { sales: 0, orders: 0, newCustomers: 0 },
  })
  const [recentOrders, setRecentOrders] = useState<VendorOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.ok ? res.json() : [])
      .then((data) => {
        const orders = Array.isArray(data) ? data : []
        const now = new Date()
        const monthOrders = orders.filter((o: { createdAt: string }) => {
          const d = new Date(o.createdAt)
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        const valid = orders.filter((o: { status: string }) => o.status !== 'cancelled')

        setVendorStats({
          totalSales: valid.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0),
          totalOrders: orders.length,
          totalCustomers: new Set(orders.map((o: { userId: string }) => o.userId)).size,
          averageRating: 4.8,
          thisMonth: {
            sales: monthOrders.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0),
            orders: monthOrders.length,
            newCustomers: new Set(monthOrders.map((o: { userId: string }) => o.userId)).size,
          },
        })

        setRecentOrders(orders.slice(0, 5).map((o: {
          id: string; total: number; status: string; createdAt: string
          user?: { name?: string | null } | null
          items?: { product?: { name?: string } | null }[]
        }) => ({
          id: o.id,
          customer: o.user?.name || 'Client',
          product: o.items?.[0]?.product?.name || 'Produit',
          amount: o.total,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
        })))

        const salesByProduct: Record<string, TopProduct> = {}
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
      .catch(err => console.error('Error fetching vendor data:', err))
  }, [])

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Vendeur</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/vendeur" className="text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
            <Link href="/revendeurs" className="text-gray-300 hover:text-ingco-yellow">Revendeurs</Link>
            <Link href="/formations" className="text-gray-300 hover:text-ingco-yellow">Formations</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">👤 Mon Compte</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Bienvenue sur votre espace revendeur</h1>
          <p className="text-gray-400">Gérez vos ventes, commandes etformations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.link} className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors text-center">
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="text-white font-semibold text-sm">{action.title}</h3>
              <p className="text-gray-400 text-xs">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Ventes Totales</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalSales.toLocaleString()} €</div>
            <div className="text-green-500 text-sm">+12% ce mois</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Commandes</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalOrders}</div>
            <div className="text-green-500 text-sm">+8 ce mois</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Clients</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalCustomers}</div>
            <div className="text-green-500 text-sm">+5 ce mois</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 textsm mb-1">Note Moyenne</div>
            <div className="text-2xl font-bold text-white">⭐ {vendorStats.averageRating}/5</div>
            <div className="text-gray-400 text-sm">Basé sur 89 avis</div>
          </div>
        </div>

        {/* This Month Stats */}
        <div className="bg-gradient-to-r from-ingco-yellow/20 to-transparent rounded-xl p-6 mb-8 border border-ingco-yellow/30">
          <h3 className="text-xl font-bold text-white mb-4">📈 Performances ce mois</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-gray-400 text-sm">Ventes</div>
              <div className="text-2xl font-bold text-ingco-yellow">{vendorStats.thisMonth.sales} €</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Commandes</div>
              <div className="text-2xl font-bold text-ingco-yellow">{vendorStats.thisMonth.orders}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Nouveaux clients</div>
              <div className="text-2xl font-bold text-ingco-yellow">+{vendorStats.thisMonth.newCustomers}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Dernières Commandes</h3>
              <Link href="/admin/orders" className="text-ingco-yellow text-sm hover:underline">Voir tout</Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-ingco-black rounded-lg p-4">
                  <div>
                    <div className="text-white font-semibold">{order.customer}</div>
                    <div className="text-gray-400 text-sm">{order.product}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{order.amount} €</div>
                    <span className={`${statusInfo(order.status).color} text-white text-xs px-2 py-1 rounded`}>
                      {statusInfo(order.status).label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Produits les Plus Vendus</h3>
              <Link href="/search" className="text-ingco-yellow text-sm hover:underline">Voir tout</Link>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between bg-ingco-black rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <div className="text-white font-semibold">{product.name}</div>
                      <div className="text-gray-400 text-sm">{product.sales} ventes</div>
                    </div>
                  </div>
                  <div className="text-ingco-yellow font-bold">{product.revenue} €</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Liens Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/revendeurs" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="text-white font-bold mb-2">Devenir Revendeur</h4>
              <p className="text-gray-400 text-sm">Proposez nos produits à vos clients</p>
            </Link>
            <Link href="/formations" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="text-white font-bold mb-2">Formations</h4>
              <p className="text-gray-400 text-sm">Développez vos compétences</p>
            </Link>
            <Link href="/admin/settings" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="text-3xl mb-3">⚙️</div>
              <h4 className="text-white font-bold mb-2">Paramètres</h4>
              <p className="text-gray-400 text-sm">Gérez votre compte</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-gray py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Outilles By ELECTRON. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
