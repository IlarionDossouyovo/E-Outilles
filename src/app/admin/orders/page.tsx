'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'

interface AdminOrder {
  id: string
  customer: string
  email: string
  phone: string
  amount: number
  status: string
  date: string
  items: string[]
}

const statusOptions = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled']

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-500' },
  processing: { label: 'En traitement', color: 'bg-blue-500' },
  paid: { label: 'Paye', color: 'bg-green-600' },
  shipped: { label: 'Expedie', color: 'bg-purple-500' },
  delivered: { label: 'Livre', color: 'bg-green-500' },
  cancelled: { label: 'Annule', color: 'bg-red-500' }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        setOrders(data.map((o: {
          id: string
          total: number
          status: string
          createdAt: string
          user?: { name?: string | null; email?: string } | null
          items?: { product?: { name?: string } | null }[]
        }) => ({
          id: o.id,
          customer: o.user?.name || 'Client',
          email: o.user?.email || '',
          phone: '',
          amount: o.total,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
          items: (o.items || []).map(i => i.product?.name).filter(Boolean) as string[],
        })))
      })
      .catch(err => console.error('Error fetching orders:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchFilter = filter === 'all' || order.status === filter
    const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                     order.id.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } else {
      alert('Erreur lors de la mise a jour du statut')
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Icon name="user" className="w-4 h-4" /> Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-ingco-yellow text-sm hover:underline inline-flex items-center gap-1"><Icon name="arrow-left" className="w-4 h-4" /> Dashboard</Link>
            <h1 className="text-3xl font-bold text-white mt-2">Gestion des commandes</h1>
            <p className="text-gray-400">{orders.length} commandes</p>
          </div>
        </div>

        {/* Analytics */}
        <AdminAnalytics data={{
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
          activeProducts: 523,
          subscribers: 3421,
          recentOrders: orders.slice(0, 5).map(o => ({ ...o, status: o.status })),
          topProducts: [
            { name: 'Perceuse visseuse INGCO 20V', sales: 89, revenue: 8011 },
            { name: 'Marteau perforateur SDS Max', sales: 45, revenue: 11249 },
            { name: 'Kit de clés mécaniques 50 pièces', sales: 67, revenue: 5359 },
            { name: 'Tronçonneuse thermique 45cm', sales: 34, revenue: 10196 },
            { name: 'Multimètre numérique professionnel', sales: 78, revenue: 4679 },
          ]
        }} />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par client ou numéro..."
              className="w-full bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white"
          >
            <option value="all">Tous les statuts</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{statusLabels[s].label}</option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-ingco-gray rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ingco-dark">
                <tr>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Commande</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Client</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Produits</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Montant</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Statut</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-ingco-dark">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{order.id}</div>
                      <div className="text-gray-500 text-sm">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{order.customer}</div>
                      <div className="text-gray-500 text-sm">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-sm">{order.items.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-ingco-yellow font-bold">{order.amount.toLocaleString()}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full text-white ${statusLabels[order.status].color}`}>
                        {statusLabels[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-ingco-black border border-ingco-dark rounded-lg px-2 py-1 text-white text-sm"
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{statusLabels[s].label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="bg-ingco-gray rounded-xl p-8 text-center text-gray-400">
              {loading ? 'Chargement des commandes...' : 'Aucune commande trouvée'}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-dark border-t border-ingco-gray py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 E-Outilles Admin.</p>
        </div>
      </footer>
    </div>
  )
}