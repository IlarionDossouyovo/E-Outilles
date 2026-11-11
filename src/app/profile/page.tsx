'use client'

import { useEffect, useState } from 'react'
import { Icon, NavigationArrows } from '@/components/Icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions'
import PageNavigation from '@/components/PageNavigation'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

interface User {
  id: string
  email: string
  name: string
  role: string
  country?: string
  isFounder?: boolean
}

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: number
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500',
  processing: 'bg-amber-500',
  paid: 'bg-green-500',
  shipped: 'bg-yellow-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('orders')
  const [accessDenied, setAccessDenied] = useState<'admin' | 'founder' | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    if (error === 'acces_refuse' || error === 'founder_only') {
      setAccessDenied(error === 'founder_only' ? 'founder' : 'admin')
      // Drop the param so the notice is not replayed on refresh/back.
      window.history.replaceState({}, '', '/profile')
    }
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/auth/login?redirect=/profile')
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
      .catch(() => router.push('/auth/login?redirect=/profile'))
  }, [router])

  const handleLogout = async () => {
    await logoutAction()
    router.push('/auth/login')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <PageNavigation backLabel={t('common.home')} />
          <div className="animate-pulse space-y-6">
            <div className="h-9 w-56 rounded-lg bg-ingco-gray" />
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-28 rounded-xl bg-ingco-gray" />
              ))}
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-ingco-gray" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <PageNavigation backLabel={t('common.home')} />

        {accessDenied && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
            {accessDenied === 'founder' ? (
              <>
                {t('profile.accessDeniedFounder')}
                {user?.email && (
                  <span className="block mt-1 text-red-200/80">
                    {t('profile.founderHint').replace('{email}', user.email || '')}
                  </span>
                )}
              </>
            ) : (
              t('profile.accessDeniedAdmin')
            )}
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('profile.title')}</h1>
            <p className="text-gray-400">{user.name || user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-400 transition-colors"
              >
                {t('profile.adminDashboard')}
              </Link>
            )}
            {user.isFounder && (
              <Link
                href="/agent"
                className="border border-ingco-yellow text-ingco-yellow px-4 py-2 rounded-xl font-medium hover:bg-ingco-yellow hover:text-ingco-black transition-colors"
              >
                {t('profile.agents')}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              {t('common.logout')}
            </button>
          </div>
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
              {tab === 'orders' && t('profile.tab.orders')}
              {tab === 'details' && t('profile.tab.details')}
              {tab === 'addresses' && t('profile.tab.addresses')}
              {tab === 'settings' && t('profile.tab.settings')}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-ingco-gray rounded-xl p-8 text-center">
                <Icon name="truck" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">{t('profile.noOrders')}</p>
                <Link href="/search" className="text-ingco-yellow hover:underline mt-3 inline-block">
                  {t('profile.browseCatalog')}
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
                      {new Date(order.date).toLocaleDateString()} • {t('profile.orderItems').replace('{n}', String(order.items))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-ingco-yellow font-bold">{order.total}€</p>
                    <Link href={`/orders/${order.id}`} className="text-ingco-yellow text-sm hover:underline">
                      {t('profile.viewDetails')}
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
              <label className="text-gray-400 text-sm">{t('profile.name')}</label>
              <p className="text-white">{user.name || t('profile.notSet')}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">{t('profile.email')}</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">{t('profile.country')}</label>
              <p className="text-white">{user.country || t('profile.notSet')}</p>
            </div>
            <button className="text-ingco-yellow text-sm hover:underline">
              {t('profile.editInfo')}
            </button>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="bg-ingco-gray rounded-xl p-6">
            <p className="text-gray-400 mb-4">{t('profile.noAddress')}</p>
            <button className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-400">
              {t('profile.addAddress')}
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-ingco-gray rounded-xl p-6 space-y-4 max-w-md">
            <label className="flex items-center justify-between">
              <span className="text-white">{t('profile.notifEmail')}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">{t('profile.newsletter')}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-white">{t('profile.notifSms')}</span>
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
