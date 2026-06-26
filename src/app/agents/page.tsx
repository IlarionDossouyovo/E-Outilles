'use client'

import { useState } from 'react'
import Link from 'next/link'

const agents = [
  {
    id: 'order',
    name: 'Agent Commandes',
    description: 'Gère les commandes, suivi, facturation et expéditions',
    status: 'actif',
    color: 'bg-blue-500',
    icon: '📦',
    tasks: ['Nouvelle commande', 'Suivi livraison', 'Facturation', 'Emballage', 'Expédition', 'Retours']
  },
  {
    id: 'support',
    name: 'Agent Support',
    description: 'Assistant client 24/7 pour toutes vos questions',
    status: 'actif',
    color: 'bg-green-500',
    icon: '💬',
    tasks: ['Questions produits', 'Retours', 'Remboursements', 'Réclamations', 'SAV', 'Garantie']
  },
  {
    id: 'marketing',
    name: 'Agent Marketing',
    description: 'Automatise vos campagnes publicitaires et SEO',
    status: 'actif',
    color: 'bg-purple-500',
    icon: '📢',
    tasks: ['Newsletter', 'Réseaux sociaux', 'SEO', 'Google Ads', 'Facebook Ads', 'Influencers']
  },
  {
    id: 'inventory',
    name: 'Agent Inventaire',
    description: 'Surveille le stock et déclenche les réapprovisionnements',
    status: 'actif',
    color: 'bg-orange-500',
    icon: '📊',
    tasks: ['Stock', 'Alertes', 'Prévisions', 'Commande fournisseur', 'Entrepôt', 'Codification']
  },
  {
    id: 'payment',
    name: 'Agent Paiements',
    description: 'Gère les paiements et les relances',
    status: 'inactif',
    color: 'bg-yellow-500',
    icon: '💳',
    tasks: ['Paiements', 'Récupération', 'Comptabilité', 'Facturation', 'Décaissement']
  },
  {
    id: 'delivery',
    name: 'Agent Livraison',
    description: 'Coordonne les livraisons avec les transporteurs',
    status: 'actif',
    color: 'bg-red-500',
    icon: '🚚',
    tasks: ['Suivi colis', 'Retours', 'Délais', 'Transporteurs', 'Preuve livraison', 'Tracking']
  },
  {
    id: 'customer',
    name: 'Agent Clients',
    description: 'Gère la relation client et la fidélité',
    status: 'actif',
    color: 'bg-pink-500',
    icon: '👥',
    tasks: ['VIP', 'Fidélité', 'Birthday', 'Satisfaction', 'Avis clients', 'Parrainage']
  },
  {
    id: 'analytics',
    name: 'Agent Analytique',
    description: 'Analyse les données et génère des rapports',
    status: 'actif',
    color: 'bg-cyan-500',
    icon: '📈',
    tasks: ['Rapports', 'Tableaux de bord', 'Prévisions', 'Tendances', 'KPI', 'ROI']
  },
  {
    id: 'supplier',
    name: 'Agent Fournisseurs',
    description: 'Gère les relations avec les fournisseurs INGCO',
    status: 'actif',
    color: 'bg-indigo-500',
    icon: '🏭',
    tasks: ['Commande fournisseur', 'Prix negotiate', 'Livraison', 'Qualité', 'Contrats', 'Délais']
  },
  {
    id: 'pricing',
    name: 'Agent Tarification',
    description: 'Optimise les prix pour maximiser les profits',
    status: 'actif',
    color: 'bg-emerald-500',
    icon: '💰',
    tasks: ['Prix optimal', 'Promotions', 'Marges', 'Concurrence', 'Soldes', 'Bundles']
  },
  {
    id: 'whatsapp',
    name: 'Agent WhatsApp',
    description: 'Gère les conversations WhatsApp',
    status: 'actif',
    color: 'bg-green-600',
    icon: '💬',
    tasks: ['Messages', 'Commandes', 'Suivi', 'Support', 'Automatique', 'Broadcast']
  },
  {
    id: 'refund',
    name: 'Agent Retours',
    description: 'Gère les demandes de retour et remboursement',
    status: 'actif',
    color: 'bg-rose-500',
    icon: '🔄',
    tasks: ['Demandes', 'Vérification', 'Remboursement', 'Stock retour', 'Analyse']
  },
  {
    id: 'shipping',
    name: 'Agent Expédition',
    description: 'Automatise la préparation des commandes',
    status: 'actif',
    color: 'bg-sky-500',
    icon: '✈️',
    tasks: ['Étiquettes', 'Emballage', 'Déclaration', 'Douanes', 'Suivi', 'Facturation']
  },
  {
    id: 'competitor',
    name: 'Agent Concurrence',
    description: 'Surveille les concurrents et le marché',
    status: 'actif',
    color: 'bg-violet-500',
    icon: '🔍',
    tasks: ['Prix concurrence', 'Nouveautés', 'Tendances', 'Alertes', 'Rapport', 'Benchmark']
  },
  {
    id: 'content',
    name: 'Agent Contenu',
    description: 'Crée le contenu marketing et produit',
    status: 'actif',
    color: 'bg-amber-500',
    icon: '🎨',
    tasks: ['Descriptions', 'Photos', 'Vidéos', 'Blog', 'Réseaux', 'Catalogues']
  },
  {
    id: 'quality',
    name: 'Agent Qualité',
    description: 'Contrôle la qualité des produits',
    status: 'actif',
    color: 'bg-teal-500',
    icon: '✅',
    tasks: ['Inspection', 'Standards', 'Photos', 'Retours', 'Notes', 'Amélioration']
  }
]

const integrations = [
  { name: 'WhatsApp Business', status: 'connecté', color: 'bg-green-500' },
  { name: 'MTN Moov Money', status: 'connecté', color: 'bg-blue-500' },
  { name: 'Orange Money', status: 'connecté', color: 'bg-orange-500' },
  { name: 'Stripe', status: 'bientôt', color: 'bg-gray-500' },
  { name: 'Mailchimp', status: 'connecté', color: 'bg-yellow-500' },
  { name: 'Google Analytics', status: 'connecté', color: 'bg-red-500' },
  { name: 'DHL Express', status: 'connecté', color: 'bg-yellow-600' },
  { name: 'FedEx', status: 'connecté', color: 'bg-purple-600' },
  { name: 'INGCO API', status: 'connecté', color: 'bg-red-700' }
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [configuring, setConfiguring] = useState(false)
  const [toast, setToast] = useState('')

  const handleConfigure = () => {
    setConfiguring(true)
    setToast(`⚙️ Configuration de ${selectedAgent.name}...`)
    setTimeout(() => {
      setToast('')
      alert(`${selectedAgent.name} configuré avec succès!\n\nTâches activées:\n${selectedAgent.tasks.map(t => '✓ ' + t).join('\n')}`)
    }, 500)
  }

  const handleTest = () => {
    alert(`🧪 Test de ${selectedAgent.name}\n\nStatut: ${selectedAgent.status === 'actif' ? 'Actif ✅' : 'Inactif ❌'}\n\nTâches: ${selectedAgent.tasks.length}`)
  }

  const handleToggleStatus = () => {
    const newStatus = selectedAgent.status === 'actif' ? 'inactif' : 'actif'
    setToast(`${selectedAgent.name} ${newStatus === 'actif' ? 'activé' : 'désactivé'}`)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
              <span className="text-ingco-black font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl">E-<span className="text-ingco-yellow">Outilles</span></span>
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Dashboard</Link>
            <Link href="/admin/agents" className="text-ingco-yellow">Agents</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold shadow-lg animate-pulse">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline">← Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">🤖 Agents IA</h1>
          <p className="text-gray-400">Automatisez votre boutique avec des agents intelligents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-white">Agents disponibles</h2>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAgent.id === agent.id
                    ? 'bg-ingco-yellow border-2 border-ingco-yellow'
                    : 'bg-ingco-gray border-2 border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-12 h-12 ${agent.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {agent.icon}
                  </span>
                  <div className="flex-1">
                    <div className="text-white font-bold">{agent.name}</div>
                    <div className="text-gray-400 text-sm">{agent.status === 'actif' ? '✓ Actif' : '○ Inactif'}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Agent Detail */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-ingco-gray rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className={`w-16 h-16 ${selectedAgent.color} rounded-2xl flex items-center justify-center text-3xl`}>
                  {selectedAgent.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                  <span className={`text-sm px-2 py-1 rounded-full ${selectedAgent.status === 'actif' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {selectedAgent.status === 'actif' ? '✓ Actif' : '○ Inactif'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">{selectedAgent.description}</p>

              <h3 className="text-white font-bold mb-3">Tâches automatisées</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedAgent.tasks.map((task, idx) => (
                  <span key={idx} className="bg-ingco-dark px-4 py-2 rounded-xl text-gray-300">
                    ✓ {task}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleConfigure}
                  className="flex-1 bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                >
                  ⚙️ Configurer
                </button>
                <button 
                  onClick={handleTest}
                  className="flex-1 bg-ingco-dark text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  🧪 Tester
                </button>
                <button 
                  onClick={handleToggleStatus}
                  className={`px-4 py-3 rounded-xl font-bold transition-colors ${
                    selectedAgent.status === 'actif' 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {selectedAgent.status === 'actif' ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔗 Intégrations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-center gap-2 p-3 bg-ingco-dark rounded-xl">
                    <span className={`w-3 h-3 ${integration.color} rounded-full`}></span>
                    <span className="text-gray-300 text-sm">{integration.name}</span>
                    <span className={`ml-auto text-xs ${integration.status === 'connecté' ? 'text-green-400' : 'text-gray-500'}`}>
                      {integration.status === 'connecté' ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-ingco-gray rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📊 Statistiques</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ingco-dark p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Messages ce mois</div>
                  <div className="text-2xl font-bold text-white">1,247</div>
                </div>
                <div className="bg-ingco-dark p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Taux de résolution</div>
                  <div className="text-2xl font-bold text-green-400">87%</div>
                </div>
                <div className="bg-ingco-dark p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Temps moyen</div>
                  <div className="text-2xl font-bold text-white">2min</div>
                </div>
                <div className="bg-ingco-dark p-4 rounded-xl">
                  <div className="text-gray-400 text-sm">Satisfaction</div>
                  <div className="text-2xl font-bold text-ingco-yellow">4.8/5</div>
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