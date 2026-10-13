'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import AdminNav from '@/components/AdminNav'
import { Icon } from '@/components/Icons'
import {
  SALES_CHANNELS,
  TRAFFIC_CHANNELS,
  UTM_MEDIUMS,
  UTM_CAMPAIGNS,
  buildCampaignUrl,
} from '@/lib/marketing/channels'
import { DEFAULT_MARKETING, type MarketingSettings } from '@/lib/settings/defaults'

interface ChannelStat {
  id: string
  name: string
  kind: 'sales' | 'traffic'
  configured: boolean
  value: string
  visits: number
  orders: number
  revenue: number
  conversion: number
  hint?: string
}

interface CampaignStat {
  campaign: string
  source: string | null
  visits: number
  orders: number
  revenue: number
  conversion: number
}

interface Analytics {
  generatedAt: string
  windowDays: number
  totals: {
    visits: number
    orders: number
    revenue: number
    conversion: number
    subscribers: number
    configuredChannels: number
    totalChannels: number
  }
  salesChannels: ChannelStat[]
  trafficChannels: ChannelStat[]
  campaigns: CampaignStat[]
}

const WINDOWS = [7, 30, 90] as const

const fmtMoney = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const fmtPct = (n: number) => `${(n * 100).toFixed(1)} %`

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-ingco-gray rounded-2xl p-5">
      <div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl md:text-3xl font-bold text-white mt-1">{value}</div>
      {hint && <div className="text-gray-500 text-xs mt-1">{hint}</div>}
    </div>
  )
}

export default function MarketingPage() {
  const [days, setDays] = useState<number>(30)
  const [marketing, setMarketing] = useState<MarketingSettings>({ ...DEFAULT_MARKETING })
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Campaign builder
  const [campUrl, setCampUrl] = useState('/')
  const [campSource, setCampSource] = useState('facebook')
  const [campMedium, setCampMedium] = useState<string>('social')
  const [campCampaign, setCampCampaign] = useState<string>('lancement')
  const [campContent, setCampContent] = useState('')

  const load = useCallback(async (window: number) => {
    setLoading(true)
    setError('')
    try {
      const [settingsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/settings').then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/marketing/analytics?days=${window}`).then((r) => (r.ok ? r.json() : null)),
      ])
      if (settingsRes?.settings?.marketing) setMarketing(settingsRes.settings.marketing)
      if (analyticsRes) setAnalytics(analyticsRes)
    } catch {
      setError('Impossible de charger les données marketing.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(days) }, [days, load])

  const setChannelValue = (id: string, value: string) =>
    setMarketing((m) => ({ ...m, channels: { ...m.channels, [id]: value } }))

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketing }),
      })
      if (!res.ok) throw new Error('save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      load(days)
    } catch {
      setError("Échec de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  const campaignUrl = useMemo(
    () => buildCampaignUrl({ url: campUrl, source: campSource, medium: campMedium, campaign: campCampaign, content: campContent }),
    [campUrl, campSource, campMedium, campCampaign, campContent]
  )

  const copyCampaign = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch {
      setError('Copie impossible - sélectionnez le lien manuellement.')
    }
  }

  const totals = analytics?.totals

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <AdminNav />
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="text-ingco-yellow text-sm hover:underline inline-flex items-center gap-1">
              <Icon name="arrow-left" className="w-4 h-4" /> Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mt-2">Marketing</h1>
            <p className="text-gray-400">Canaux de vente, canaux de trafic et attribution des campagnes</p>
          </div>
          <div className="flex items-center gap-2">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setDays(w)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${days === w ? 'bg-ingco-yellow text-ingco-black' : 'bg-ingco-gray text-gray-300 hover:text-ingco-yellow'}`}
              >
                {w} j
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard label="Visites attribuées" value={totals ? String(totals.visits) : '—'} hint={`${days} derniers jours`} />
          <StatCard label="Commandes" value={totals ? String(totals.orders) : '—'} />
          <StatCard label="Revenu attribué" value={totals ? fmtMoney(totals.revenue) : '—'} />
          <StatCard label="Conversion" value={totals ? fmtPct(totals.conversion) : '—'} />
          <StatCard label="Abonnés" value={totals ? String(totals.subscribers) : '—'} />
          <StatCard
            label="Canaux actifs"
            value={totals ? `${totals.configuredChannels}/${totals.totalChannels}` : '—'}
            hint="configurés"
          />
        </div>

        {/* Campaign builder */}
        <section className="bg-ingco-gray rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Icon name="megaphone" className="w-5 h-5 text-ingco-yellow" /> Générateur de liens de campagne
          </h2>
          <p className="text-gray-500 text-sm mb-5">Créez un lien UTM traçable à coller dans vos publications et publicités.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-400 text-xs">URL de destination</span>
              <input value={campUrl} onChange={(e) => setCampUrl(e.target.value)} placeholder="/categories"
                className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none" />
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Source (utm_source)</span>
              <input value={campSource} onChange={(e) => setCampSource(e.target.value)} placeholder="facebook"
                className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none" />
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Support (utm_medium)</span>
              <select value={campMedium} onChange={(e) => setCampMedium(e.target.value)}
                className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none">
                {UTM_MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Campagne (utm_campaign)</span>
              <select value={campCampaign} onChange={(e) => setCampCampaign(e.target.value)}
                className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none">
                {UTM_CAMPAIGNS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-400 text-xs">Contenu (utm_content, optionnel)</span>
              <input value={campContent} onChange={(e) => setCampContent(e.target.value)} placeholder="video-1"
                className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none" />
            </label>
            <div className="flex items-end">
              <button onClick={copyCampaign} className="w-full bg-ingco-yellow text-ingco-black py-2 rounded-lg font-bold hover:bg-yellow-400">
                Copier le lien
              </button>
            </div>
          </div>
          <div className="mt-4 bg-ingco-dark rounded-lg p-3 text-sm text-ingco-yellow break-all font-mono">{campaignUrl}</div>
        </section>

        {/* Sales channels */}
        <ChannelSection
          title="Canaux de vente"
          subtitle="Où vos clients peuvent acheter"
          channels={analytics?.salesChannels || SALES_CHANNELS.map((d) => ({ ...d, configured: !d.needsValue, value: '', visits: 0, orders: 0, revenue: 0, conversion: 0 }))}
          values={marketing.channels}
          onChange={setChannelValue}
          showVisits={false}
        />

        {/* Traffic channels */}
        <ChannelSection
          title="Canaux de trafic"
          subtitle="Réseaux sociaux, publicités et acquisition"
          channels={analytics?.trafficChannels || TRAFFIC_CHANNELS.map((d) => ({ ...d, configured: !d.needsValue, value: '', visits: 0, orders: 0, revenue: 0, conversion: 0 }))}
          values={marketing.channels}
          onChange={setChannelValue}
          showVisits
        />

        {/* Campaigns */}
        <section className="bg-ingco-gray rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Performance par campagne</h2>
          {analytics && analytics.campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-ingco-dark">
                    <th className="py-2">Campagne</th>
                    <th className="py-2">Source</th>
                    <th className="py-2 text-right">Visites</th>
                    <th className="py-2 text-right">Commandes</th>
                    <th className="py-2 text-right">Revenu</th>
                    <th className="py-2 text-right">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.campaigns.map((c) => (
                    <tr key={c.campaign} className="border-b border-ingco-dark/50">
                      <td className="py-2 text-white">{c.campaign}</td>
                      <td className="py-2 text-gray-400">{c.source || '—'}</td>
                      <td className="py-2 text-right text-gray-300">{c.visits}</td>
                      <td className="py-2 text-right text-gray-300">{c.orders}</td>
                      <td className="py-2 text-right text-ingco-yellow">{fmtMoney(c.revenue)}</td>
                      <td className="py-2 text-right text-gray-300">{fmtPct(c.conversion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Aucune campagne attribuée pour l&apos;instant. Utilisez le générateur de liens ci-dessus,
              puis partagez le lien sur vos réseaux : les visites et commandes apparaîtront ici.
            </p>
          )}
        </section>

        {/* Global settings + save */}
        <section className="bg-ingco-gray rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Réglages marketing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Numéro WhatsApp commandes" value={marketing.whatsappOrderNumber} onChange={(v) => setMarketing((m) => ({ ...m, whatsappOrderNumber: v }))} placeholder="+229 01 977 003 47" />
            <Field label="Source UTM par défaut" value={marketing.defaultUtmSource} onChange={(v) => setMarketing((m) => ({ ...m, defaultUtmSource: v }))} placeholder="facebook" />
            <Field label="Google Analytics (G-XXXX)" value={marketing.gaMeasurementId} onChange={(v) => setMarketing((m) => ({ ...m, gaMeasurementId: v }))} placeholder="G-XXXXXXXXXX" />
            <Field label="Meta Pixel (Facebook/Instagram)" value={marketing.metaPixelId} onChange={(v) => setMarketing((m) => ({ ...m, metaPixelId: v }))} placeholder="1234567890" />
            <Field label="TikTok Pixel" value={marketing.tiktokPixelId} onChange={(v) => setMarketing((m) => ({ ...m, tiktokPixelId: v }))} placeholder="XXXXXXXX" />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={save} disabled={saving} className="bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {saved && <span className="text-green-400 text-sm inline-flex items-center gap-1"><Icon name="check" className="w-4 h-4" /> Enregistré</span>}
            {loading && <span className="text-gray-500 text-sm">Chargement...</span>}
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-gray-400 text-xs">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none"
      />
    </label>
  )
}

function ChannelSection({
  title, subtitle, channels, values, onChange, showVisits,
}: {
  title: string
  subtitle: string
  channels: ChannelStat[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
  showVisits: boolean
}) {
  return (
    <section className="bg-ingco-gray rounded-2xl p-6 mb-10">
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      <p className="text-gray-500 text-sm mb-5">{subtitle}</p>
      <div className="space-y-3">
        {channels.map((c) => (
          <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-ingco-dark rounded-xl p-3">
            <div className="md:col-span-3">
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.configured ? 'bg-green-500' : 'bg-gray-600'}`} />
                {c.name}
              </div>
              {c.hint && <div className="text-gray-500 text-xs mt-0.5">{c.hint}</div>}
            </div>
            <div className="md:col-span-5">
              <input
                value={values[c.id] ?? ''}
                onChange={(e) => onChange(c.id, e.target.value)}
                placeholder={c.value || 'Non configuré'}
                className="w-full bg-ingco-black text-white text-sm px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none"
              />
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center">
              {showVisits && (
                <div>
                  <div className="text-gray-500 text-[10px] uppercase">Visites</div>
                  <div className="text-white text-sm font-bold">{c.visits}</div>
                </div>
              )}
              <div className={showVisits ? '' : 'col-start-2'}>
                <div className="text-gray-500 text-[10px] uppercase">Cmd</div>
                <div className="text-white text-sm font-bold">{c.orders}</div>
              </div>
              <div>
                <div className="text-gray-500 text-[10px] uppercase">Revenu</div>
                <div className="text-ingco-yellow text-sm font-bold">{fmtMoney(c.revenue)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
