'use client'

import { useState } from 'react'
import Link from 'next/link'

const founder = {
  name: 'Ilarion Dossouyovo',
  role: 'Fondateur & PDG',
  email: 'ilarion@e-outilles.com',
  phone: '+229 97 12 34 56',
  avatar: '👨‍💼',
  since: '2024',
  vision: 'Démocratiser l\'accès aux outils professionnels de qualité pour tous les artisans du monde'
}

const agents = [
  { id: 1, name: 'Assistant IA', status: 'online', type: 'chat', icon: '🤖', conversations: 156 },
  { id: 2, name: 'Vendeur Bot', status: 'online', type: 'sales', icon: '💼', conversations: 89 },
  { id: 3, name: 'Support Client', status: 'online', type: 'support', icon: '🎧', conversations: 234 },
  { id: 4, name: 'Suivi Commande', status: 'offline', type: 'tracking', icon: '📦', conversations: 0 },
]

const stats = {
  totalConversations: 479,
  activeAgents: 3,
  messagesToday: 1247,
  satisfaction: 94.5
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
              <span className="text-ingco-black font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl">E-<span className="text-ingco-yellow">Outilles</span></span>
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
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors">
            <span>←</span> Retour Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="text-gray-400 hover:text-ingco-yellow text-sm">Chat IA</Link>
            <span className="text-gray-600">|</span>
            <Link href="/admin" className="text-gray-400 hover:text-ingco-yellow text-sm">Dashboard</Link>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🤖 Tableau de Bord Agents IA</h1>
          <p className="text-gray-400">Gestion des assistants virtuels et automatisations</p>
        </div>

        {/* Founder Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">{founder.avatar}</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{founder.name}</h2>
              <p className="text-purple-200 font-semibold">{founder.role}</p>
              <p className="text-purple-100 text-sm mt-2">📧 {founder.email}</p>
              <p className="text-purple-100 text-sm">📞 {founder.phone}</p>
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
              <span className="text-gray-400 text-sm">Conversations totales</span>
              <span className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">💬</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalConversations}</div>
            <div className="text-green-500 text-sm mt-1">+23% ce mois</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Agents actifs</span>
              <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">✓</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats.activeAgents}/4</div>
            <div className="text-gray-500 text-sm mt-1">En ligne</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Messages aujourd'hui</span>
              <span className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">📝</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.messagesToday}</div>
            <div className="text-green-500 text-sm mt-1">+15% vs hier</div>
          </div>

          <div className="bg-ingco-gray rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Satisfaction</span>
              <span className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">⭐</span>
            </div>
            <div className="text-3xl font-bold text-ingco-yellow">{stats.satisfaction}%</div>
            <div className="text-green-500 text-sm mt-1">Excellent</div>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-ingco-gray rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">🤖 Agents IA Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-ingco-dark p-4 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{agent.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">{agent.name}</h3>
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
                      <Link href={agent.type === 'chat' ? '/chat' : '#'} className="text-ingco-yellow text-sm hover:underline">
                        Tester →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/chat" className="bg-ingco-gray rounded-2xl p-6 hover:bg-gray-700 transition-colors block">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-white font-bold mb-2">Assistant Principal</h3>
            <p className="text-gray-400 text-sm">Accéder au chat Ollama</p>
          </Link>

          <Link href="/admin" className="bg-ingco-gray rounded-2xl p-6 hover:bg-gray-700 transition-colors block">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-white font-bold mb-2">Dashboard Admin</h3>
            <p className="text-gray-400 text-sm">Voir les statistiques</p>
          </Link>

          <Link href="/admin/orders" className="bg-ingco-gray rounded-2xl p-6 hover:bg-gray-700 transition-colors block">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="text-white font-bold mb-2">Suivi Commandes</h3>
            <p className="text-gray-400 text-sm">Gérer les commandes</p>
          </Link>
        </div>
      </div>
    </div>
  )
}