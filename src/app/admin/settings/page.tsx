'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'
import Logo from '@/components/Logo'
import AdminNav from '@/components/AdminNav'
import { Icon } from '@/components/Icons'
import { DEFAULT_SETTINGS, type StoreSettings } from '@/lib/settings/defaults'

interface IntegrationStatus {
  googleAI: boolean
  ollama: boolean
  ollamaReachable: boolean
  resend: boolean
  stripe: boolean
  stripeWebhook: boolean
}

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  activeProducts: number
  subscribers: number
  recentOrders: Array<{ id: string; customer: string; amount: number; status: string; date: string }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
}

const EMPTY_ANALYTICS: AnalyticsData = {
  totalOrders: 0,
  totalRevenue: 0,
  activeProducts: 0,
  subscribers: 0,
  recentOrders: [],
  topProducts: [],
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-ingco-dark rounded-xl">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${ok ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {ok ? 'Configuré' : 'Non configuré'}
      </span>
    </div>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
  const [integrations, setIntegrations] = useState<IntegrationStatus | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData>(EMPTY_ANALYTICS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsRes, orders, products, subs] = await Promise.all([
        fetch('/api/admin/settings').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/orders').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/products?limit=1000').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/newsletter').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ])
      if (settingsRes?.settings) setSettings(settingsRes.settings)
      if (settingsRes?.integrations) setIntegrations(settingsRes.integrations)

      const orderList: Array<{ id: string; total: number; status: string; createdAt: string; user?: { name?: string | null; email?: string } }> = Array.isArray(orders) ? orders : orders?.orders || []
      const productList: Array<{ id: string; name: string; price: number; stock: number; sales?: number }> = Array.isArray(products) ? products : products?.products || []
      const subList: Array<unknown> = Array.isArray(subs) ? subs : []

      const revenue = orderList.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
      const topProducts = productList
        .map((p) => ({ name: p.name, sales: Number(p.sales) || 0, revenue: (Number(p.sales) || 0) * (Number(p.price) || 0) }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setAnalytics({
        totalOrders: orderList.length,
        totalRevenue: Math.round(revenue * 100) / 100,
        activeProducts: productList.length,
        subscribers: subList.length,
        recentOrders: orderList.slice(0, 5).map((o) => ({
          id: o.id,
          customer: o.user?.name || o.user?.email || 'Client',
          amount: Number(o.total) || 0,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString('fr-FR'),
        })),
        topProducts,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Enregistrement impossible')
        return
      }
      if (data.settings) setSettings(data.settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setSaving(false)
    }
  }

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }))

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <AdminNav />
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline inline-flex items-center gap-1"><Icon name="arrow-left" className="w-4 h-4" /> Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">Paramètres</h1>
          <p className="text-gray-400">Configurez votre boutique</p>
        </div>

        {/* Analytics */}
        {!loading && <AdminAnalytics data={analytics} />}

        <div className="space-y-6">
          {/* État des intégrations */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="zap" className="w-5 h-5 text-ingco-yellow" /> État des intégrations</h2>
            {integrations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <StatusBadge ok={integrations.googleAI} label="Google AI (Gemini)" />
                <div className="flex items-center justify-between p-3 bg-ingco-dark rounded-xl">
                  <span className="text-gray-300 text-sm">Ollama (local)</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    integrations.ollamaReachable
                      ? 'bg-green-500/20 text-green-400'
                      : integrations.ollama
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {integrations.ollamaReachable ? 'En ligne' : integrations.ollama ? 'Injoignable' : 'Non configuré'}
                  </span>
                </div>
                <StatusBadge ok={integrations.resend} label="Resend (emails)" />
                <StatusBadge ok={integrations.stripe} label="Stripe (paiements)" />
                <StatusBadge ok={integrations.stripeWebhook} label="Stripe webhook" />
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Chargement…</p>
            )}
            <p className="text-gray-500 text-xs mt-3">
              Les clés se définissent dans le fichier <code className="text-ingco-yellow">.env</code> ; redémarrez le serveur après modification.
            </p>
          </div>

          {/* Informations boutique */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="info" className="w-5 h-5 text-ingco-yellow" /> Informations boutique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Nom de la boutique</label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => update('shopName', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Téléphone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Adresse</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => update('address', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="grid" className="w-5 h-5 text-ingco-yellow" /> Localisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Devise</label>
                <select
                  value={settings.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                >
                  <option value="EUR">EUR (Euro)</option>
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Fuseau horaire</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => update('timezone', e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                >
                  <option value="Africa/Porto-Novo">Bénin (WAT)</option>
                  <option value="Africa/Dakar">Sénégal (GMT)</option>
                  <option value="Africa/Abidjan">Côte d&apos;Ivoire (GMT)</option>
                  <option value="Europe/Paris">France (CET)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="truck" className="w-5 h-5 text-ingco-yellow" /> Livraison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Livraison gratuite (€)</label>
                <input
                  type="number"
                  value={settings.shippingFree}
                  onChange={(e) => update('shippingFree', Number(e.target.value))}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Frais de livraison (€)</label>
                <input
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => update('shippingCost', Number(e.target.value))}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">TVA (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => update('taxRate', Number(e.target.value))}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Paiements */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="card" className="w-5 h-5 text-ingco-yellow" /> Moyens de paiement</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Paiement à la livraison (COD)</div>
                  <div className="text-gray-500 text-sm">Frais: {settings.codFee}€</div>
                </div>
                <input type="checkbox" checked={settings.codEnabled} onChange={(e) => update('codEnabled', e.target.checked)} className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Argent mobile</div>
                  <div className="text-gray-500 text-sm">MTN, Moov, Orange Money</div>
                </div>
                <input type="checkbox" checked={settings.momoEnabled} onChange={(e) => update('momoEnabled', e.target.checked)} className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Carte bancaire</div>
                  <div className="text-gray-500 text-sm">
                    Visa, Mastercard — {integrations?.stripe ? 'actif' : 'clé Stripe requise'}
                  </div>
                </div>
                <input type="checkbox" checked={settings.cardEnabled} onChange={(e) => update('cardEnabled', e.target.checked)} className="w-5 h-5 accent-ingco-yellow" />
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="info" className="w-5 h-5 text-ingco-yellow" /> Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Courriel de notification</div>
                  <div className="text-gray-500 text-sm">Nouvelle commande, contact...</div>
                </div>
                <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => update('emailNotifications', e.target.checked)} className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Notifications SMS</div>
                  <div className="text-gray-500 text-sm">Alertes importantes</div>
                </div>
                <input type="checkbox" checked={settings.smsNotifications} onChange={(e) => update('smsNotifications', e.target.checked)} className="w-5 h-5 accent-ingco-yellow" />
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          {/* Enregistrer */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-60"
          >
            <Icon name="check" className="w-4 h-4 inline" /> {saving ? 'Enregistrement…' : saved ? 'Paramètres enregistrés !' : 'Enregistrer les paramètres'}
          </button>
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
