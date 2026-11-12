'use client'

import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/Icons'

interface ProductLite {
  id: string
  name: string
  slug: string
  images: string
}

interface Asset {
  id: string
  kind: string
  channel: string | null
  locale: string
  title: string | null
  body: string | null
  status: string
}

interface Job {
  id: string
  channel: string
  action: string
  status: string
  error: string | null
  createdAt: string
}

const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
]

const KIND_LABEL: Record<string, string> = {
  description: 'Description',
  social_post: 'Publication',
  script: 'Script vidéo',
  seo: 'SEO',
  image: 'Image',
  video: 'Vidéo',
}

const STATUS_STYLE: Record<string, string> = {
  done: 'bg-green-500/20 text-green-300',
  ready: 'bg-green-500/20 text-green-300',
  queued: 'bg-amber-500/20 text-amber-300',
  running: 'bg-amber-500/20 text-amber-300',
  failed: 'bg-red-500/20 text-red-300',
  draft: 'bg-white/10 text-gray-300',
}

// Admin control panel: pick a product, generate its AI launch kit (description,
// social posts, video script) across locales, and drain the publish queue.
export default function AutomationPanel() {
  const [products, setProducts] = useState<ProductLite[]>([])
  const [productId, setProductId] = useState('')
  const [locales, setLocales] = useState<string[]>(['fr'])
  const [assets, setAssets] = useState<Asset[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=200')
      if (res.ok) {
        const data = await res.json()
        const list: ProductLite[] = Array.isArray(data) ? data : data.products || []
        setProducts(list)
        if (list[0] && !productId) setProductId(list[0].id)
      }
    } catch {
      setNotice('Chargement des produits impossible')
    }
  }, [productId])

  const loadProduct = useCallback(async (id: string) => {
    if (!id) return
    try {
      const res = await fetch(`/api/products/${id}/assets`)
      if (res.ok) {
        const data = await res.json()
        setAssets(data.assets || [])
        setJobs(data.jobs || [])
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    loadProduct(productId)
  }, [productId, loadProduct])

  function toggleLocale(code: string) {
    setLocales((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]))
  }

  async function generate(sync: boolean) {
    if (!productId) return
    setBusy(true)
    setNotice('')
    try {
      const res = await fetch('/api/marketing/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', productId, locales, sync }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice(data.error || 'Génération impossible')
      } else if (sync) {
        const r = data.result
        setNotice(`Kit généré (${r.provider}) — ${r.assetsCreated} contenus, ${r.jobsQueued} publications en file, langues: ${r.locales.join(', ')}`)
      } else {
        setNotice('Génération mise en file. Cliquez sur « Traiter la file » pour l’exécuter.')
      }
      await loadProduct(productId)
    } finally {
      setBusy(false)
    }
  }

  async function processQueue() {
    setBusy(true)
    setNotice('')
    try {
      const res = await fetch('/api/marketing/queue', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        const s = data.summary
        setNotice(`File traitée — kits: ${s.kits.processed}, publiés: ${s.publishes.sent}, préparés: ${s.publishes.prepared}, échecs: ${s.publishes.failed}, restants: ${s.remaining}`)
      } else {
        setNotice(data.error || 'Traitement impossible')
      }
      await loadProduct(productId)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bg-ingco-gray rounded-2xl p-6 mb-10">
      <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
        <Icon name="sparkles" className="w-5 h-5 text-ingco-yellow" /> Automatisation marketing IA
      </h2>
      <p className="text-gray-500 text-sm mb-5">
        Chaque image produit ajoutée génère automatiquement description, publications et script vidéo, puis met en file la
        publication sur tous les canaux configurés.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="block md:col-span-2">
          <span className="text-gray-400 text-xs">Produit</span>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 w-full bg-ingco-dark text-white px-3 py-2 rounded-lg border border-ingco-gray focus:border-ingco-yellow outline-none"
          >
            {products.length === 0 && <option value="">Aucun produit</option>}
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            onClick={() => generate(false)}
            disabled={busy || !productId}
            className="flex-1 bg-ingco-yellow text-ingco-black py-2 rounded-lg font-bold hover:bg-yellow-400 disabled:opacity-50"
          >
            {busy ? 'Traitement…' : 'Générer le kit'}
          </button>
          <button
            onClick={processQueue}
            disabled={busy}
            className="px-3 py-2 rounded-lg border border-ingco-gray text-gray-200 hover:text-ingco-yellow disabled:opacity-50"
          >
            Traiter la file
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-gray-400 text-xs">Langues :</span>
        {LOCALES.map((l) => (
          <button
            key={l.code}
            onClick={() => toggleLocale(l.code)}
            className={`px-3 py-1 rounded-full text-xs border ${locales.includes(l.code) ? 'border-ingco-yellow text-ingco-yellow' : 'border-ingco-gray text-gray-400'}`}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => generate(true)}
          disabled={busy || !productId}
          className="ml-auto px-3 py-1 rounded-full text-xs border border-ingco-gray text-gray-300 hover:text-ingco-yellow disabled:opacity-50"
        >
          Générer maintenant (synchrone)
        </button>
      </div>

      {notice && <div className="bg-ingco-dark border border-ingco-yellow/30 text-ingco-yellow text-sm rounded-lg px-4 py-2 mb-4">{notice}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Contenus générés ({assets.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {assets.length === 0 && <p className="text-gray-500 text-sm">Aucun contenu pour ce produit.</p>}
            {assets.map((a) => (
              <div key={a.id} className="bg-ingco-dark rounded-lg p-3 border border-ingco-gray">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{KIND_LABEL[a.kind] || a.kind}</span>
                  {a.channel && <span className="text-xs text-ingco-yellow">{a.channel}</span>}
                  <span className="text-xs text-gray-500 uppercase">{a.locale}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[a.status] || ''}`}>{a.status}</span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-3">{a.body || a.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-2">File de publication ({jobs.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {jobs.length === 0 && <p className="text-gray-500 text-sm">Aucune tâche pour ce produit.</p>}
            {jobs.map((j) => (
              <div key={j.id} className="bg-ingco-dark rounded-lg p-3 border border-ingco-gray flex items-center gap-2">
                <span className="text-sm text-white flex-1">{j.channel}</span>
                <span className="text-xs text-gray-500">{j.action}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[j.status] || ''}`}>{j.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
