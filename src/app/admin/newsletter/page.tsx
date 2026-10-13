'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'
import Logo from '@/components/Logo'
import AdminNav from '@/components/AdminNav'
import { Icon } from '@/components/Icons'
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics'

interface Subscriber {
  id: string
  email: string
  name: string | null
  createdAt: string
  status: string
}

const templates = [
  { id: 1, name: 'Nouveaux produits', subject: 'Découvrez nos nouveautés!' },
  { id: 2, name: 'Promotions', subject: 'Offre spéciale -50%' },
  { id: 3, name: 'Panier abandonné', subject: 'Vous avez oublié quelque chose...' },
  { id: 4, name: 'Newsletter mensuelle', subject: 'Votre sélection du mois' },
]

export default function NewsletterPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [template, setTemplate] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const { data: analytics, loading: analyticsLoading } = useAdminAnalytics()

  useEffect(() => {
    fetch('/api/newsletter')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSubscribers(data) })
      .catch(err => console.error('Error fetching subscribers:', err))
  }, [])

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Renseignez un objet et un contenu avant d’envoyer.')
      return
    }
    setSending(true)
    setResult('')
    setError('')
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Envoi impossible')
        return
      }
      setResult(`Campagne envoyée : ${data.sent}/${data.total} abonnés${data.failed ? ` (${data.failed} échec(s))` : ''}.`)
      setSubject('')
      setBody('')
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setSending(false)
    }
  }

  const selectTemplate = (id: string) => {
    const t = templates.find(t => t.id.toString() === id)
    if (t) {
      setSubject(t.subject)
      setTemplate(id)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="horizontal" size={40} />
          <AdminNav />
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline inline-flex items-center gap-1"><Icon name="arrow-left" className="w-4 h-4" /> Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">Newsletter</h1>
          <p className="text-gray-400">Envoyez des emails à vos abonnés</p>
        </div>

        {/* Analytics */}
        <AdminAnalytics data={analytics} loading={analyticsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Composer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="chat" className="w-5 h-5 text-ingco-yellow" /> Composer</h2>
              
              {/* Modèles */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Modèle</label>
                <select 
                  value={template} 
                  onChange={(e) => selectTemplate(e.target.value)}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                >
                  <option value="">Sélectionner un modèle...</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Sujet */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Sujet *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet de l'email..."
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Votre message..."
                  rows={8}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>

              {/* Envoyer */}
              <button
                onClick={handleSend}
                disabled={sending || !subject}
                className={`w-full py-4 rounded-xl font-bold transition-colors ${
                  sending 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-ingco-yellow text-ingco-black hover:bg-yellow-400'
                }`}
              >
                {sending ? 'Envoi en cours...' : `Envoyer à ${subscribers.filter(s => s.status === 'active').length} abonnés`}
              </button>

              {result && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm">{result}</div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}
            </div>
          </div>

          {/* Abonnés */}
          <div className="space-y-6">
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="user" className="w-5 h-5 text-ingco-yellow" /> Abonnés ({subscribers.length})</h2>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subscribers.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-ingco-dark rounded-xl">
                    <div>
                      <div className="text-white text-sm font-medium">{sub.name}</div>
                      <div className="text-gray-500 text-xs">{sub.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sub.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Icon name="grid" className="w-5 h-5 text-ingco-yellow" /> Statistiques</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total abonnés</span>
                  <span className="text-white font-bold">{subscribers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Actifs</span>
                  <span className="text-green-400 font-bold">{subscribers.filter(s => s.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux d'ouverture</span>
                  <span className="text-ingco-yellow font-bold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux de clic</span>
                  <span className="text-ingco-yellow font-bold">24%</span>
                </div>
              </div>
            </div>
          </div>
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