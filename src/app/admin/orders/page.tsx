'use client'

import { useState } from 'react'
import Link from 'next/link'

const allOrders = [
  { id: 'ORD-001', customer: 'Jean Kouassi', email: 'jean@example.com', phone: '+229 01 234 5678', amount: 459.99, status: 'pending', date: '16/04/2026', items: ['Cric hydraulique 3T'] },
  { id: 'ORD-002', customer: 'Marie Diallo', email: 'marie@example.com', phone: '+229 01 234 5679', amount: 189.00, status: 'shipped', date: '15/04/2026', items: ['Multimètre digital'] },
  { id: 'ORD-003', customer: 'Paul Okonkwo', email: 'paul@example.com', phone: '+229 01 234 5680', amount: 899.50, status: 'delivered', date: '15/04/2026', items: ['Tronçonneuse thermique', 'Système irrigation'] },
  { id: 'ORD-004', customer: 'Anne Mensah', email: 'anne@example.com', phone: '+229 01 234 5681', amount: 234.00, status: 'processing', date: '14/04/2026', items: ['Kit clés mécaniques'] },
  { id: 'ORD-005', customer: 'Pierre Ngoma', email: 'pierre@example.com', phone: '+229 01 234 5682', amount: 567.00, status: 'pending', date: '14/04/2026', items: ['Perceuse visseuse', 'Marteau perforateur'] },
  { id: 'ORD-006', customer: 'Sophie Martin', email: 'sophie@example.com', phone: '+229 01 234 5683', amount: 145.00, status: 'delivered', date: '13/04/2026', items: ['Pinces isolées'] },
  { id: 'ORD-007', customer: 'Ali Baba', email: 'ali@example.com', phone: '+229 01 234 5684', amount: 320.00, status: 'shipped', date: '12/04/2026', items: ['Compresseur portable'] },
  { id: 'ORD-008', customer: 'Fatou Diallo', email: 'fatou@example.com', phone: '+229 01 234 5685', amount: 78.00, status: 'processing', date: '11/04/2026', items: ['Testeur de tension'] },
]

const statusOptions = ['pending', 'processing', 'shipped', 'delivered']

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-500' },
  processing: { label: 'En traitement', color: 'bg-blue-500' },
  shipped: { label: 'Expédié', color: 'bg-purple-500' },
  delivered: { label: 'Livré', color: 'bg-green-500' }
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredOrders = allOrders.filter(order => {
    const matchFilter = filter === 'all' || order.status === filter
    const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                     order.id.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateStatus = (orderId: string, newStatus: string) => {
    alert(`Commande ${orderId} mise à jour: ${statusLabels[newStatus].label}`)
  }

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
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">👤 Admin</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-ingco-yellow text-sm hover:underline">← Dashboard</Link>
            <h1 className="text-3xl font-bold text-white mt-2">Gestion des commandes</h1>
            <p className="text-gray-400">{allOrders.length} commandes</p>
          </div>
        </div>

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
            <div className="text-center py-12">
              <p className="text-gray-400">Aucune commande trouvée</p>
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