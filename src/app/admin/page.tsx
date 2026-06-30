'use client'

import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'

const stats = {
  totalOrders: 1247,
  totalRevenue: 89450,
  activeProducts: 523,
  subscribers: 3421
}

const recentOrders = [
  { id: 'ORD-001', customer: 'Jean Kouassi', amount: 459.99, status: 'pending', date: '16/04/2026' },
  { id: 'ORD-002', customer: 'Marie Diallo', amount: 189.00, status: 'shipped', date: '15/04/2026' },
  { id: 'ORD-003', customer: 'Paul Okonkwo', amount: 899.50, status: 'delivered', date: '15/04/2026' },
  { id: 'ORD-004', customer: 'Anne Mensah', amount: 234.00, status: 'processing', date: '14/04/2026' },
  { id: 'ORD-005', customer: 'Pierre Ngoma', amount: 567.00, status: 'pending', date: '14/04/2026' },
]

const topProducts = [
  { name: 'Perceuse visseuse INGCO 20V', sales: 89, revenue: 8011 },
  { name: 'Marteau perforateur SDS Max', sales: 45, revenue: 11249 },
  { name: 'Kit de clés mécaniques 50 pièces', sales: 67, revenue: 5359 },
  { name: 'Tronconneuse thermique 45cm', sales: 34, revenue: 10196 },
  { name: 'Multimètre numérique professionnel', sales: 78, revenue: 4679 },
]

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'en attente', color: 'bg-yellow-500' },
  processing: { label: 'traitement', color: 'bg-blue-500' },
  shipped: { label: 'expédié', color: 'bg-purple-500' },
  delivered: { label: 'livré', color: 'bg-green-500' }
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
              <span className="text-ingco-black font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl">E-<span className="text-ingco-yellow">Outilles</span></span>
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
            <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow">Messages</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">👤 Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
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
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">📦</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-green-500 text-sm mt-1">+12% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Chiffre d'affaires</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">💰</span>
            </div>
            <div className="text-3xl font-bold text-ingco-yellow">{stats.totalRevenue.toLocaleString()}€</div>
            <div className="text-green-500 text-sm mt-1">+8% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Produits actifs</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">🛠️</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeProducts}</div>
            <div className="text-gray-500 text-sm mt-1">5 nouveaux ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Newsletter Abonnés</span>
              <span className="w-10 h-10 bg-ingco-yellow/20 rounded-xl flex items-center justify-center">📧</span>
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
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
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
            <span className="text-2xl block mb-2">➕</span>
            <span className="text-white text-sm">Ajouter produit</span>
          </Link>
          <Link href="/admin/orders" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <span className="text-2xl block mb-2">📦</span>
            <span className="text-white text-sm">Gérer commandes</span>
          </Link>
          <Link href="/admin/newsletter" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-white text-sm">Newsletter</span>
          </Link>
          <Link href="/agent" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <span className="text-2xl block mb-2">🤖</span>
            <span className="text-white text-sm">Agents IA</span>
          </Link>
          <Link href="/admin/settings" className="bg-ingco-gray p-4 rounded-xl text-center hover:bg-ingco-dark transition-colors block">
            <span className="text-2xl block mb-2">⚙️</span>
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
