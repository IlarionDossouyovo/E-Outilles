'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Code secret du fondateur (à changer)
const FOUNDER_CODE = 'EO2024'

const founder = {
  name: 'Ilarion Dossouyovo',
  role: 'Fondateur & PDG',
  email: 'ilarion@e-outilles.com',
  phone: '+229 01 977 003 47',
  avatar: '👨‍💼',
  since: '2024',
  vision: 'Démocratiser l\'accès aux outils professionnels de qualité pour tous les artisans du monde'
}

// Agents IA pour l'entreprise
const allAgents = [
  // Agents principaux
  { id: 1, name: 'Assistant IA', status: 'online', type: 'chat', icon: '🤖', conversations: 156, category: 'principal',
    description: 'Assistant conversationnel principal pour les clients',
    features: ['Recommandations produits', 'Questions techniques', 'Conseils utilisation', 'suivi projet'],
    color: 'from-purple-500 to-indigo-600' },
  { id: 2, name: 'Vendeur Bot', status: 'online', type: 'sales', icon: '💼', conversations: 89, category: 'principal',
    description: 'Automatisation des ventes et conversion',
    features: ['Qualification leads', 'Closing automatique', 'Suivi panier abandonné', 'Promotions personnalisées'],
    color: 'from-green-500 to-emerald-600' },
  { id: 3, name: 'Support Client', status: 'online', type: 'support', icon: '🎧', conversations: 234, category: 'principal',
    description: 'Support client automatisé 24/7',
    features: ['FAQ automatique', 'Ouverture tickets', 'Suivi résolution', 'Escalade humaine'],
    color: 'from-blue-500 to-cyan-600' },
  { id: 4, name: 'Suivi Commande', status: 'offline', type: 'tracking', icon: '📦', conversations: 0, category: 'principal',
    description: 'Suivi et gestion des commandes',
    features: ['Tracking temps réel', 'Notifications livraison', 'Retours & échanges', 'Suivi fournisseurs'],
    color: 'from-orange-500 to-amber-600' },
  // Nouveaux agents additionnels
  { id: 5, name: 'Chef de Projet IA', status: 'online', type: 'project', icon: '📋', conversations: 67, category: 'management',
    description: 'Gestion de projets et planification',
    features: ['Planification tâches', 'Suivi deadlines', 'Coordination équipe', 'Rapports avance'],
    color: 'from-indigo-500 to-purple-600' },
  { id: 6, name: 'Analyste Data', status: 'online', type: 'analytics', icon: '📊', conversations: 45, category: 'management',
    description: 'Analyse des données бизнес',
    features: ['Rapports ventes', 'Analyse tendances', 'Prévisions', 'Tableaux de bord'],
    color: 'from-pink-500 to-rose-600' },
  { id: 7, name: 'Marketing Bot', status: 'online', type: 'marketing', icon: '📢', conversations: 123, category: 'marketing',
    description: 'Automatisation marketing digital',
    features: ['Campagnes email', 'SEO optimisation', 'Gestion réseaux sociaux', 'Contenu automatique'],
    color: 'from-red-500 to-orange-600' },
  { id: 8, name: 'Assistant RH', status: 'offline', type: 'hr', icon: '👥', conversations: 0, category: 'management',
    description: 'Gestion des ressources humaines',
    features: ['Recrutement', 'Onboarding', 'Gestion congès', 'Formation'],
    color: 'from-teal-500 to-cyan-600' },
  { id: 9, name: 'Comptable IA', status: 'offline', type: 'finance', icon: '💳', conversations: 0, category: 'finance',
    description: 'Gestion financière et comptable',
    features: ['Facturation', 'Suivi trésorerie', 'Rapports financiers', 'Prévisions budétaires'],
    color: 'from-yellow-500 to-amber-600' },
  { id: 10, name: 'Legal Bot', status: 'offline', type: 'legal', icon: '⚖️', conversations: 0, category: 'finance',
    description: 'Assistant juridique et conformité',
    features: ['Contrats types', 'CGU/RGPD', 'Mentions légales', 'Conseils juridiques'],
    color: 'from-slate-500 to-gray-600' },
]

const agents = allAgents.filter(a => a.category === 'principal')
const extraAgents = allAgents.filter(a => a.category !== 'principal')

const stats = {
  totalConversations: 714,
  activeAgents: 7,
  totalAgents: 10,
  offlineAgents: 3,
  messagesToday: 1247,
  satisfaction: 94.5
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [accessGranted, setAccessGranted] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [error, setError] = useState('')

  const verifyCode = () => {
    if (codeInput === FOUNDER_CODE) {
      setAccessGranted(true)
      setError('')
    } else {
      setError('Code incorrect')
    }
  }

  // Auto-redirect si pas de code
  useEffect(() => {
    const stored = localStorage.getItem('founder_access')
    if (stored === 'granted') {
      setAccessGranted(true)
    }
  }, [])

  const grantAccess = () => {
    if (codeInput === FOUNDER_CODE) {
      localStorage.setItem('founder_access', 'granted')
      setAccessGranted(true)
      setError('')
    } else {
      setError('Code secret incorrect')
    }
  }

  // Page d'accès si pas autorisé
  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-ingco-black flex items-center justify-center p-4">
        <div className="bg-ingco-gray rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-white">Accès Réservé</h1>
            <p className="text-gray-400 mt-2">Entrez votre code secret pour accéder aux agents IA</p>
          </div>
          <input
            type="password"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Code secret..."
            className="w-full bg-ingco-dark text-white px-4 py-3 rounded-xl mb-4 border border-ingco-gray focus:border-ingco-yellow outline-none"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={grantAccess}
            className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400"
          >
            Valider
          </button>
          <Link href="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-ingco-yellow">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="horizontal" size={40} />
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded ml-2">Agents</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Admin</Link>
            <Link href="/agent" className="text-ingco-yellow">Agents IA</Link>
            <Link href="/chat" className="text-gray-300 hover:text-ingco-yellow">Chat</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors bg-ingco-gray px-4 py-2 rounded-lg">
            <span>←</span> Retour Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="bg-purple-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-600">Chat IA</Link>
            <span className="text-gray-600">|</span>
            <Link href="/admin" className="text-gray-400 hover:text-ingco-yellow text-sm">Dashboard</Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🤖 Tableau de Bord Agents IA</h1>
          <p className="text-gray-400">Gestion des assistants virtuels et automatisations</p>
        </div>

        {/* Founder Section with Logo */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
                <span className="text-6xl font-bold text-black">E</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">CEO</div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{founder.name}</h2>
              <p className="text-purple-200 font-semibold text-lg">{founder.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <a href={`mailto:${founder.email}`} className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors">
                  <span>📧</span> {founder.email}
                </a>
                <a href={`tel:${founder.phone}`} className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors">
                  <span>📞</span> {founder.phone}
                </a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-purple-200 text-sm">Fondé en {founder.since}</p>
              <p className="text-white font-medium mt-2 max-w-xs">{founder.vision}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Agents</span>
              <span className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">🤖</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalAgents}</div>
            <div className="text-gray-500 text-sm mt-1">Configurés</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Agents actifs</span>
              <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">✓</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats.activeAgents}/{stats.totalAgents}</div>
            <div className="text-gray-500 text-sm mt-1">En ligne</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Conversations</span>
              <span className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">💬</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalConversations}</div>
            <div className="text-green-500 text-sm mt-1">+23% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Hors ligne</span>
              <span className="w-10 h-10 bg-gray-500/20 rounded-xl flex items-center justify-center">💤</span>
            </div>
            <div className="text-3xl font-bold text-gray-400">{stats.offlineAgents}</div>
            <div className="text-gray-500 text-sm mt-1">À activer</div>
          </div>
        </div>

        {/* Agents List with Animation */}
        <div className="bg-ingco-gray rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🤖 Agents IA Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="bg-ingco-dark p-4 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{agent.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold group-hover:text-ingco-yellow transition-colors">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${agent.status === 'online' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {agent.status === 'online' ? '🟢 En ligne' : '⚪ Hors ligne'}
                      </span>
                    </div>
                    <p className="text-purple-400 text-sm font-medium mt-1">{agent.type === 'chat' ? 'Assistant conversationnel' : agent.type === 'sales' ? 'Vente automatisée' : agent.type === 'support' ? 'Support client' : 'Suivi commandes'}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {agent.type === 'chat' && '• Recommandations produits\n• Réponses aux questions techniques\n• Conseils d\'utilisation'}
                      {agent.type === 'sales' && '• Qualification leads\n• Closing automatique\n• Suivi panier abandonné'}
                      {agent.type === 'support' && '• FAQ automatique\n• Ouverture tickets\n• Suivi résolution'}
                      {agent.type === 'tracking' && '• Tracking commandes\n• Notifications livraison\n• Retours & échanges'}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-400 text-sm">{agent.conversations} conversations</span>
                      <button 
                        onClick={() => alert(`🔧 Configuration de ${agent.name}\n\nStatut: ${agent.status}\nType: ${agent.type}\nFonctionnalités:\n${agent.features?.join('\n')}`)}
                        className="text-ingco-yellow text-sm hover:underline"
                      >
                        Config →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Agents - Management & Marketing */}
        <div className="bg-ingco-gray rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-6">⚙️ Agents Avancés (Management & Marketing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraAgents.map((agent, index) => (
              <div 
                key={agent.id} 
                className={`bg-gradient-to-r ${agent.color} p-4 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{agent.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold group-hover:text-white">{agent.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded bg-white/20 ${agent.status === 'online' ? 'text-green-300' : 'text-gray-300'}`}>
                        {agent.status === 'online' ? '🟢' : '⚪'}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{agent.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded text-white">{f}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-white/60 text-xs">{agent.conversations} conv.</span>
                      <button 
                        onClick={() => alert(`⚙️ ${agent.name}\n\n${agent.description}\n\nFonctionnalités:\n${agent.features?.join('\n')}`)}
                        className="text-xs text-white underline"
                      >
                        Config →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions with Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link href="/chat" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 hover:scale-110 transition-all duration-300 block text-center">
            <div className="text-2xl mb-1">🤖</div>
            <h3 className="text-white font-bold text-sm">Assistant</h3>
          </Link>

          <Link href="/admin" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <div className="text-2xl mb-1">📊</div>
            <h3 className="text-white font-bold text-sm">Dashboard</h3>
          </Link>

          <Link href="/admin/orders" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <div className="text-2xl mb-1">📦</div>
            <h3 className="text-white font-bold text-sm">Commandes</h3>
          </Link>

          <Link href="/" className="bg-ingco-gray rounded-xl p-4 hover:bg-gray-700 transition-colors block text-center">
            <div className="text-2xl mb-1">🏠</div>
            <h3 className="text-white font-bold text-sm">Accueil</h3>
          </Link>
        </div>
      </div>
    </div>
  )
}