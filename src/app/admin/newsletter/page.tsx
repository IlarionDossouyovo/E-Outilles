'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminAnalytics from '@/components/AdminAnalytics'
import Logo from '@/components/Logo'

const subscribers = [
  { id: 1, email: 'jean@example.com', name: 'Jean Kouassi', date: '16/04/2026', status: 'actif' },
  { id: 2, email: 'marie@example.com', name: 'Marie Diallo', date: '15/04/2026', status: 'actif' },
  { id: 3, email: 'paul@example.com', name: 'Paul Okonkwo', date: '14/04/2026', status: 'actif' },
  { id: 4, email: 'anne@example.com', name: 'Anne Mensah', date: '13/04/2026', status: 'actif' },
  { id: 5, email: 'pierre@example.com', name: 'Pierre Ngoma', date: '12/04/2026', status: 'inactif' },
]

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

  const handleSend = () => {
    setSending(true)
    setTimeout(() => {
      setSending(false)
      alert(`Newsletter "${subject}" envoyée à ${subscribers.filter(s => s.status === 'actif').length} abonnés!`)
    }, 2000)
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
          <Link href="/admin" className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline">← Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">Newsletter</h1>
          <p className="text-gray-400">Envoyez des emails à vos abonnés</p>
        </div>

        {/* Analytics */}
        <AdminAnalytics data={{
          totalOrders: 1247,
          totalRevenue: 89450,
          activeProducts: 523,
          subscribers: subscribers.length,
          recentOrders: [
            { id: 'ORD-001', customer: 'Jean Kouassi', amount: 459.99, status: 'pending', date: '16/04/2026' },
            { id: 'ORD-002', customer: 'Marie Diallo', amount: 189.00, status: 'shipped', date: '15/04/2026' },
            { id: 'ORD-003', customer: 'Paul Okonkwo', amount: 899.50, status: 'delivered', date: '15/04/2026' },
            { id: 'ORD-004', customer: 'Anne Mensah', amount: 234.00, status: 'processing', date: '14/04/2026' },
            { id: 'ORD-005', customer: 'Pierre Ngoma', amount: 567.00, status: 'pending', date: '14/04/2026' },
          ],
          topProducts: [
            { name: 'Perceuse visseuse INGCO 20V', sales: 89, revenue: 8011 },
            { name: 'Marteau perforateur SDS Max', sales: 45, revenue: 11249 },
            { name: 'Kit de clés mécaniques 50 pièces', sales: 67, revenue: 5359 },
            { name: 'Tronçonneuse thermique 45cm', sales: 34, revenue: 10196 },
            { name: 'Multimètre numérique professionnel', sales: 78, revenue: 4679 },
          ]
        }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Composer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">✉️ Composer</h2>
              
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
                {sending ? '⏳ Envoi en cours...' : `📤 Envoyer à ${subscribers.filter(s => s.status === 'actif').length} abonnés`}
              </button>
            </div>
          </div>

          {/* Abonnés */}
          <div className="space-y-6">
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">👥 Abonnés ({subscribers.length})</h2>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subscribers.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-ingco-dark rounded-xl">
                    <div>
                      <div className="text-white text-sm font-medium">{sub.name}</div>
                      <div className="text-gray-500 text-xs">{sub.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sub.status === 'actif' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📊 Statistiques</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total abonnés</span>
                  <span className="text-white font-bold">{subscribers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Actifs</span>
                  <span className="text-green-400 font-bold">{subscribers.filter(s => s.status === 'actif').length}</span>
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