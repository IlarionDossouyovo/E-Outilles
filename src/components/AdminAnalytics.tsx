'use client'

import Link from 'next/link'

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  activeProducts: number
  subscribers: number
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
    status: string
    date: string
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'en attente', color: 'bg-yellow-500' },
  processing: { label: 'traitement', color: 'bg-blue-500' },
  shipped: { label: 'expédié', color: 'bg-purple-500' },
  delivered: { label: 'livré', color: 'bg-green-500' }
}

export default function AdminAnalytics({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Total Commandes</span>
            <span className="text-2xl">📦</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.totalOrders.toLocaleString()}</div>
          <div className="text-green-500 text-sm mt-2">↑ 12% ce mois</div>
        </div>
        
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Revenu Total</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.totalRevenue.toLocaleString()}€</div>
          <div className="text-green-500 text-sm mt-2">↑ 8% ce mois</div>
        </div>
        
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Produits</span>
            <span className="text-2xl">🔧</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.activeProducts}</div>
          <div className="text-green-500 text-sm mt-2">↑ 3 nouveaux</div>
        </div>
        
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Abonnés</span>
            <span className="text-2xl">📧</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.subscribers.toLocaleString()}</div>
          <div className="text-green-500 text-sm mt-2">↑ 45 nouveaux</div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <h3 className="text-xl font-bold text-white mb-4">📦 Commandes Récentes</h3>
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-ingco-black rounded-lg">
                <div>
                  <div className="text-white font-medium">{order.customer}</div>
                  <div className="text-gray-500 text-sm">{order.id} • {order.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{order.amount}€</div>
                  <span className={`text-xs px-2 py-1 rounded ${statusLabels[order.status]?.color} text-white`}>
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/orders" className="block text-center text-ingco-yellow mt-4 hover:underline">
            Voir toutes les commandes →
          </Link>
        </div>

        {/* Top Products */}
        <div className="bg-ingco-dark rounded-xl p-6 border border-ingco-gray">
          <h3 className="text-xl font-bold text-white mb-4">🔥 Produits Populaires</h3>
          <div className="space-y-3">
            {data.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-ingco-black rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold">#{index + 1}</span>
                  <span className="text-white">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-ingco-yellow font-bold">{product.revenue}€</div>
                  <div className="text-gray-500 text-sm">{product.sales} ventes</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/add-product" className="block text-center text-ingco-yellow mt-4 hover:underline">
            Ajouter un produit →
          </Link>
        </div>
      </div>
    </div>
  )
}