'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  name: string
  country?: string
  joinedAt?: string
}

interface Order {
  id: string
  date: string
  total: number
  status: 'pending' | 'shipped' | 'delivered'
  items: number
}

const mockOrders: Order[] = [
  { id: 'ORD-001', date: '2026-04-10', total: 459.99, status: 'delivered', items: 3 },
  { id: 'ORD-002', date: '2026-04-05', total: 189.00, status: 'shipped', items: 2 },
  { id: 'ORD-003', date: '2026-04-01', total: 899.50, status: 'pending', items: 5 },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('orders')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('eoutilles_user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('eoutilles_user')
    router.push('/')
  }

  if (!user) return null

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    shipped: 'bg-purple-500', 
    delivered: 'bg-green-500'
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
            <p className="text-gray-400">{user.name || user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="border border-red-500 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
          >
            Deconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {['orders', 'details', 'addresses', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-ingco-yellow text-ingco-black' 
                  : 'bg-ingco-gray text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'orders' && 'Commandes'}
              {tab === 'details' && 'Informations'}
              {tab === 'addresses' && 'Adresses'}
              {tab === 'settings' && 'Parametres'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {mockOrders.map(order => (
              <div key={order.id} className="bg-ingco-gray rounded-xl p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{order.date} • {order.items} produit(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ingco-yellow font-bold">{order.total}€</p>
                    <Link href={`/orders/${order.id}`} className="text-ingco-yellow text-sm hover:underline">
                      Voir details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-ingco-gray rounded-xl p-6 space-y-4 max-w-md">
            <div>
              <label className="text-gray-400 text-sm">Nom</label>
              <p className="text-white">{user.name || 'Non defini'}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Pays</label>
              <p className="text-white">{user.country || 'Non defini'}</p>
            </div>
            <button className="text-ingco-yellow text-sm hover:underline">
              Modifier mes informations
            </button>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-ingco-gray rounded-xl p-6">
            <p className="text-gray-400 mb-4">Aucune adresse enregistree</p>
            <button className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-400">
              Ajouter une adresse
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-ingco-gray rounded-xl p-6 space-y-4 max-w-md">
            <label className="flex items-center justify-between">
              <span className="text-white">Notifications email</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">Newsletter</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">Notifications SMS</span>
              <input type="checkbox" className="w-5 h-5" />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
