'use client'

import { useEffect, useState } from 'react'
import { Icon, NavigationArrows } from '@/components/Icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions'
import PageNavigation from '@/components/PageNavigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  country?: string
}

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: number
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  paid: 'bg-green-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('orders')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/auth/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
          setOrders(data.orders || [])
        }
      })
      .catch(() => router.push('/auth/login'))
  }, [router])

  const handleLogout = async () => {
    await logoutAction()
    router.push('/auth/login')
    router.refresh()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <PageNavigation backLabel="Accueil" />
        
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
            {orders.length === 0 ? (
              <div className="bg-ingco-gray rounded-xl p-8 text-center">
                <Icon name="truck" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Aucune commande pour le moment</p>
                <Link href="/search" className="text-ingco-yellow hover:underline mt-3 inline-block">
                  Découvrir le catalogue
                </Link>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-ingco-gray rounded-xl p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[order.status] || 'bg-gray-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(order.date).toLocaleDateString('fr-FR')} • {order.items} produit(s)
                    </p>
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
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/profile" />
      </div>
    </div>
  )
}
