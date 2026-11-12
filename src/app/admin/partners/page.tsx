'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Logo from '@/components/Logo'
import { Icon } from '@/components/Icons'
import AdminNav from '@/components/AdminNav'

interface PartnerStats {
  totalReferrals: number
  pendingCommission: number
  approvedCommission: number
  paidCommission: number
  totalRevenue: number
  tier: string
  quests: { id: string; label: string; target: number; reward: string; progress: number; done: boolean }[]
}

interface Partner {
  id: string
  type: string
  name: string
  company: string | null
  email: string
  phone: string | null
  country: string | null
  city: string | null
  referralCode: string
  commissionPct: number
  discountPct: number
  status: string
  tier: string
  createdAt: string
  stats?: PartnerStats
}

const TIER_STYLE: Record<string, string> = {
  bronze: 'bg-amber-700/20 text-amber-300',
  argent: 'bg-gray-400/20 text-gray-200',
  or: 'bg-ingco-yellow/20 text-ingco-yellow',
  platine: 'bg-cyan-400/20 text-cyan-200',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-500/20 text-green-300',
  pending: 'bg-amber-500/20 text-amber-300',
  suspended: 'bg-red-500/20 text-red-300',
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({
    type: 'reseller',
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    commissionPct: '10',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/partners')
      if (res.ok) setPartners(await res.json())
    } catch {
      setNotice('Chargement impossible')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    if (filter === 'all') return partners
    return partners.filter((p) => p.type === filter || p.status === filter)
  }, [partners, filter])

  async function createPartner() {
    if (!form.name || !form.email) {
      setNotice('Nom et email requis')
      return
    }
    setBusy('create')
    setNotice('')
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, commissionPct: Number(form.commissionPct) || 10 }),
      })
      const data = await res.json()
      if (!res.ok) setNotice(data.error || 'Création impossible')
      else {
        setNotice(`Partenaire créé — code ${data.referralCode}`)
        setForm({ type: 'reseller', name: '', company: '', email: '', phone: '', city: '', commissionPct: '10' })
        await load()
      }
    } finally {
      setBusy(null)
    }
  }

  async function act(id: string, payload: Record<string, unknown>, label: string) {
    setBusy(id)
    setNotice('')
    try {
      const res = await fetch(`/api/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setNotice(label)
        await load()
      } else {
        setNotice('Action impossible')
      }
    } finally {
      setBusy(null)
    }
  }

  async function payout(id: string) {
    setBusy(id)
    setNotice('')
    try {
      const res = await fetch(`/api/partners/${id}/payout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json()
      if (res.ok) {
        setNotice(`Paiement enregistré: ${data.payout.amount} €`)
        await load()
      } else {
        setNotice(data.error || 'Paiement impossible')
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black text-white">
      <header className="border-b border-white/10 bg-ingco-dark/60 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Logo variant="horizontal" size={36} />
          <AdminNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Partenaires, revendeurs &amp; affiliés</h1>
            <p className="text-gray-400 text-sm">Commissions, paliers, quêtes et paiements.</p>
          </div>
          <div className="flex gap-2">
            {['all', 'reseller', 'affiliate', 'active'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  filter === f ? 'border-ingco-yellow text-ingco-yellow' : 'border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'reseller' ? 'Revendeurs' : f === 'affiliate' ? 'Affiliés' : 'Actifs'}
              </button>
            ))}
          </div>
        </div>

        {notice && <div className="rounded-lg border border-ingco-yellow/30 bg-ingco-yellow/10 px-4 py-2 text-sm text-ingco-yellow">{notice}</div>}

        <section className="card-premium p-5">
          <h2 className="font-semibold mb-4">Nouveau partenaire</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2"
            >
              <option value="reseller">Revendeur</option>
              <option value="affiliate">Affilié</option>
            </select>
            <input placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <input placeholder="Entreprise" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <input placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <input placeholder="Commission %" value={form.commissionPct} onChange={(e) => setForm({ ...form, commissionPct: e.target.value })} className="bg-ingco-dark border border-white/10 rounded-lg px-3 py-2" />
            <button
              onClick={createPartner}
              disabled={busy === 'create'}
              className="bg-ingco-yellow text-black font-semibold rounded-lg px-4 py-2 disabled:opacity-50"
            >
              {busy === 'create' ? 'Création…' : 'Créer le partenaire'}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="text-gray-400">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400">Aucun partenaire pour ce filtre.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <article key={p.id} className="card-premium p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{p.company || p.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TIER_STYLE[p.tier] || ''}`}>{p.tier}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status] || ''}`}>{p.status}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{p.type}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {p.name} · {p.email} · code <span className="text-ingco-yellow font-mono">{p.referralCode}</span> · {p.commissionPct}%
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => act(p.id, { action: 'approve_commissions' }, 'Commissions approuvées')} disabled={busy === p.id} className="text-sm border border-white/10 rounded-lg px-3 py-1.5 hover:text-ingco-yellow">
                      Approuver
                    </button>
                    <button onClick={() => payout(p.id)} disabled={busy === p.id} className="text-sm border border-white/10 rounded-lg px-3 py-1.5 hover:text-ingco-yellow">
                      Payer
                    </button>
                    <button
                      onClick={() => act(p.id, { status: p.status === 'active' ? 'suspended' : 'active' }, 'Statut mis à jour')}
                      disabled={busy === p.id}
                      className="text-sm border border-white/10 rounded-lg px-3 py-1.5 hover:text-ingco-yellow"
                    >
                      {p.status === 'active' ? 'Suspendre' : 'Activer'}
                    </button>
                  </div>
                </div>

                {p.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 text-sm">
                    <Stat label="Ventes" value={String(p.stats.totalReferrals)} />
                    <Stat label="CA apporté" value={`${p.stats.totalRevenue} €`} />
                    <Stat label="En attente" value={`${p.stats.pendingCommission} €`} />
                    <Stat label="Approuvé" value={`${p.stats.approvedCommission} €`} />
                    <Stat label="Payé" value={`${p.stats.paidCommission} €`} />
                  </div>
                )}

                {p.stats?.quests?.length ? (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Quêtes</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {p.stats.quests.map((q) => (
                        <div key={q.id} className={`flex items-center gap-2 text-sm rounded-lg border px-3 py-2 ${q.done ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'}`}>
                          <Icon name={q.done ? 'check' : 'target'} className={`w-4 h-4 ${q.done ? 'text-green-400' : 'text-gray-400'}`} />
                          <span className="flex-1">{q.label}</span>
                          <span className="text-gray-400">{q.progress}/{q.target}</span>
                          <span className="text-xs text-ingco-yellow">{q.reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ingco-dark border border-white/10 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
