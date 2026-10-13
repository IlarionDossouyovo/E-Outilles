'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'
import AdminNav from '@/components/AdminNav'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  country: string | null
  createdAt: string
  orderCount: number
  totalSpent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customers')
      .then((r) => (r.ok ? r.json() : { customers: [] }))
      .then((data) => setCustomers(Array.isArray(data.customers) ? data.customers : []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) =>
      [c.name, c.email, c.city, c.country, c.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [customers, query])

  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </div>
          <AdminNav />
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <Icon name="user" className="w-4 h-4" /> Admin
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-gray-400">{customers.length} client(s) · {totalSpent.toLocaleString('fr-FR')}€ de chiffre d&apos;affaires</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client (nom, email, ville, pays)..."
            className="w-full max-w-md bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="bg-ingco-gray rounded-2xl p-8 text-center text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <Icon name="user" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Aucun client trouve</p>
          </div>
        ) : (
          <div className="bg-ingco-gray rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ingco-dark text-left text-gray-400">
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Localisation</th>
                    <th className="px-4 py-3 font-medium text-right">Commandes</th>
                    <th className="px-4 py-3 font-medium text-right">Total depense</th>
                    <th className="px-4 py-3 font-medium">Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-ingco-dark/60 hover:bg-ingco-dark/40 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-gray-300">
                        <div>{c.email}</div>
                        {c.phone && <div className="text-gray-500">{c.phone}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {[c.city, c.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-white">{c.orderCount}</td>
                      <td className="px-4 py-3 text-right text-ingco-yellow font-bold">
                        {c.totalSpent.toLocaleString('fr-FR')}€
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
