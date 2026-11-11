'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon, NavigationArrows } from '@/components/Icons'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

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

const statusColors: Record<string, string> = {
  pending: 'bg-gray-500',
  processing: 'bg-amber-500',
  paid: 'bg-green-600',
  shipped: 'bg-yellow-600',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
}

const QUICK_ACTIONS = [
  { icon: 'grid', title: 'vendor.qa.stocks', desc: 'vendor.qa.stocksDesc', link: '/admin/products' },
  { icon: 'blog', title: 'vendor.qa.reports', desc: 'vendor.qa.reportsDesc', link: '/admin/orders' },
  { icon: 'user', title: 'vendor.qa.clients', desc: 'vendor.qa.clientsDesc', link: '/profile' },
  { icon: 'chat', title: 'vendor.qa.messages', desc: 'vendor.qa.messagesDesc', link: '/chat' },
  { icon: 'star', title: 'vendor.qa.training', desc: 'vendor.qa.trainingDesc', link: '/formations' },
  { icon: 'download', title: 'vendor.qa.documents', desc: 'vendor.qa.documentsDesc', link: '/formations' },
]

export default function VendorDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [vendorStats, setVendorStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageBasket: 0,
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
          averageBasket: valid.length
            ? Math.round((valid.reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0) / valid.length) * 100) / 100
            : 0,
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
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">{t('vendor.badge')}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">{t('vendor.nav.home')}</Link>
            <Link href="/vendeur" className="text-ingco-yellow">{t('vendor.nav.dashboard')}</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">{t('vendor.nav.products')}</Link>
            <Link href="/revendeurs" className="text-gray-300 hover:text-ingco-yellow">{t('vendor.nav.resellers')}</Link>
            <Link href="/formations" className="text-gray-300 hover:text-ingco-yellow">{t('vendor.nav.training')}</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2"><Icon name="user" className="w-4 h-4" /> {t('vendor.nav.account')}</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{t('vendor.welcome')}</h1>
          <p className="text-gray-400">{t('vendor.welcomeText')}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {QUICK_ACTIONS.map((action, index) => (
            <Link key={index} href={action.link} className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors text-center">
              <Icon name={action.icon as never} className="w-7 h-7 text-ingco-yellow mx-auto mb-2" />
              <h3 className="text-white font-semibold text-sm">{t(action.title)}</h3>
              <p className="text-gray-400 text-xs">{t(action.desc)}</p>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">{t('vendor.stats.totalSales')}</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalSales.toLocaleString()} €</div>
            <div className="text-gray-400 text-sm">{t('vendor.stats.sinceLaunch')}</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">{t('vendor.stats.orders')}</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalOrders}</div>
            <div className="text-green-500 text-sm">{t('vendor.stats.thisMonth').replace('{n}', String(vendorStats.thisMonth.orders))}</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">{t('vendor.stats.customers')}</div>
            <div className="text-2xl font-bold text-white">{vendorStats.totalCustomers}</div>
            <div className="text-green-500 text-sm">{t('vendor.stats.thisMonth').replace('{n}', String(vendorStats.thisMonth.newCustomers))}</div>
          </div>
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">{t('vendor.stats.basket')}</div>
            <div className="text-2xl font-bold text-white flex items-center gap-1"><Icon name="cart" className="w-5 h-5 text-ingco-yellow" /> {vendorStats.averageBasket.toLocaleString()} €</div>
            <div className="text-gray-400 text-sm">{t('vendor.stats.validOrders')}</div>
          </div>
        </div>

        {/* This Month Stats */}
        <div className="bg-gradient-to-r from-ingco-yellow/20 to-transparent rounded-xl p-6 mb-8 border border-ingco-yellow/30">
          <h3 className="text-xl font-bold text-white mb-4">{t('vendor.month.title')}</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-gray-400 text-sm">{t('vendor.month.sales')}</div>
              <div className="text-2xl font-bold text-ingco-yellow">{vendorStats.thisMonth.sales} €</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">{t('vendor.month.orders')}</div>
              <div className="text-2xl font-bold text-ingco-yellow">{vendorStats.thisMonth.orders}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">{t('vendor.month.customers')}</div>
              <div className="text-2xl font-bold text-ingco-yellow">+{vendorStats.thisMonth.newCustomers}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{t('vendor.recentOrders')}</h3>
              <Link href="/admin/orders" className="text-ingco-yellow text-sm hover:underline">{t('vendor.viewAll')}</Link>
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
                    <span className={`${statusColors[order.status] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded`}>
                      {t(`vendor.status.${order.status}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-ingco-gray rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{t('vendor.topProducts')}</h3>
              <Link href="/search" className="text-ingco-yellow text-sm hover:underline">{t('vendor.viewAll')}</Link>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between bg-ingco-black rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Icon name="tools" className="w-6 h-6 text-ingco-yellow" />
                    <div>
                      <div className="text-white font-semibold">{product.name}</div>
                      <div className="text-gray-400 text-sm">{t('vendor.salesCount').replace('{n}', String(product.sales))}</div>
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
          <h3 className="text-xl font-bold text-white mb-4">{t('vendor.quickLinks')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/revendeurs" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <Icon name="user" className="w-8 h-8 text-ingco-yellow mb-3" />
              <h4 className="text-white font-bold mb-2">{t('vendor.link.reseller')}</h4>
              <p className="text-gray-400 text-sm">{t('vendor.link.resellerDesc')}</p>
            </Link>
            <Link href="/formations" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <Icon name="star" className="w-8 h-8 text-ingco-yellow mb-3" />
              <h4 className="text-white font-bold mb-2">{t('vendor.qa.training')}</h4>
              <p className="text-gray-400 text-sm">{t('vendor.link.trainingDesc')}</p>
            </Link>
            <Link href="/admin/settings" className="bg-ingco-gray rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <Icon name="settings" className="w-8 h-8 text-ingco-yellow mb-3" />
              <h4 className="text-white font-bold mb-2">{t('vendor.link.settings')}</h4>
              <p className="text-gray-400 text-sm">{t('vendor.link.settingsDesc')}</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-gray py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Outilles By ELECTRON. {t('vendor.rights')}</p>
        </div>
      </footer>

      <div className="mt-12">
        <NavigationArrows current="/vendeur" />
      </div>
    </div>
  )
}
