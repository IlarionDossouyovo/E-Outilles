'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'
import AdminNav from '@/components/AdminNav'

interface ResellerRequest {
  id: string
  company: string
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  message: string | null
  status: string
  createdAt: string
}

const STATUSES = ['new', 'contacted', 'approved', 'rejected'] as const
const STATUS_LABEL: Record<string, string> = {
  new: 'Nouvelle',
  contacted: 'Contactée',
  approved: 'Approuvée',
  rejected: 'Refusée',
}
const STATUS_STYLE: Record<string, string> = {
  new: 'bg-ingco-yellow/20 text-ingco-yellow',
  contacted: 'bg-amber-500/20 text-amber-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
}

export default function AdminResellersPage() {
  const [requests, setRequests] = useState<ResellerRequest[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/resellers')
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) => setRequests(Array.isArray(data.requests) ? data.requests : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return requests.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false
      if (!q) return true
      return [r.company, r.name, r.email, r.city, r.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [requests, query, filter])

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/resellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      }
    } finally {
      setBusyId(null)
    }
  }

  const counts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </div>
          <AdminNav />
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <Icon name="user" className="w-4 h-4" /> Admin
          </span>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <Icon name="arrow-left" className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Demandes revendeurs</h1>
          <p className="text-gray-400">
            {requests.length} demande(s) · {counts.new || 0} nouvelle(s) en attente
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (entreprise, contact, email, ville)..."
            className="w-full max-w-md bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {['all', ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === s ? 'bg-ingco-yellow text-ingco-black' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'
                }`}
              >
                {s === 'all' ? 'Toutes' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-ingco-gray rounded-2xl p-8 text-center text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <Icon name="user" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Aucune demande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="bg-ingco-gray rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold">{r.company}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLE[r.status] || 'bg-ingco-dark text-gray-300'}`}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {r.name} · <a href={`mailto:${r.email}`} className="text-ingco-yellow hover:underline">{r.email}</a>
                      {r.phone && <> · {r.phone}</>}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {[r.city, r.address].filter(Boolean).join(', ') || 'Localisation non renseignée'} ·{' '}
                      {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    {r.message && <p className="text-gray-400 text-sm mt-2 max-w-2xl">{r.message}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.filter((s) => s !== r.status).map((s) => (
                      <button
                        key={s}
                        disabled={busyId === r.id}
                        onClick={() => updateStatus(r.id, s)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-ingco-dark text-gray-200 hover:bg-ingco-yellow hover:text-ingco-black transition-colors disabled:opacity-50"
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
