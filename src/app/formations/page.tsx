'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Vidéos de formation par catégorie
const videoModules = [
  {
    category: 'Outils Électriques',
    videos: [
      { title: 'Comment utiliser une perceuse visseuse', duration: '5:30', thumbnail: '🔩' },
      { title: 'Guide meuleuse angulaire', duration: '7:15', thumbnail: '⚙️' },
      { title: 'Marteau perforateur: Mode d\'emploi', duration: '10:45', thumbnail: '🔨' }
    ]
  },
  {
    category: 'Outils Sans Fil',
    videos: [
      { title: 'Bien choisir sa batterie 20V', duration: '4:20', thumbnail: '🔋' },
      { title: 'Entretien des batteries lithium-ion', duration: '6:00', thumbnail: '⚡' }
    ]
  },
  {
    category: 'Sécurité',
    videos: [
      { title: ' EPI obligatoires sur chantier', duration: '8:30', thumbnail: '🦺' },
      { title: 'Sécurité électrique: Les essentiels', duration: '12:15', thumbnail: '⚡' }
    ]
  },
  {
    category: 'Jardinage',
    videos: [
      { title: 'Entretien tronçonneuse', duration: '9:00', thumbnail: '🌿' },
      { title: 'Réglage tondeuse thermique', duration: '6:45', thumbnail: '🪥' }
    ]
  }
]

// Ressources écrites (Articles/Tutoriels)
const writtenResources = [
  {
    title: 'Guide complet: Choisir son outil électrique',
    category: 'Outils Électriques',
    type: 'Guide PDF',
    pages: 24,
    download: '/downloads/guide-outils-electriques.pdf'
  },
  {
    title: 'Catalogue technique INGCO 2026',
    category: 'Tous produits',
    type: 'Catalogue',
    pages: 120,
    download: '/downloads/catalogue-ingco-2026.pdf'
  },
  {
    title: 'Maintenance préventive des outils',
    category: 'Technique',
    type: 'Guide',
    pages: 18,
    download: '/downloads/maintenance-preventive.pdf'
  },
  {
    title: 'Sécurité sur les chantiers',
    category: 'Sécurité',
    type: 'Guide',
    pages: 32,
    download: '/downloads/guide-securite-chantier.pdf'
  },
  {
    title: 'Comparatif batteries 12V vs 20V',
    category: 'Outils Sans Fil',
    type: 'Fiche technique',
    pages: 8,
    download: '/downloads/comparatif-batteries.pdf'
  },
  {
    title: 'Guide d\'achat: Tronçonneuse',
    category: 'Jardinage',
    type: 'Guide',
    pages: 16,
    download: '/downloads/guide-tronconneuse.pdf'
  }
]

// Données des formations
const formations = [
  {
    id: 'produits',
    title: 'Formation Produits INGCO',
    icon: '🔧',
    description: 'Maîtrisez toute la gamme de produits INGCO pour mieux conseiller vos clients.',
    duration: '2 jours',
    level: 'Débutant',
    price: 'Inclus',
    videos: 5,
    articles: 8,
    pdfs: 3,
    program: [
      'Présentation des 15 catégories de produits',
      'Spécifications techniques détaillées',
      'Comparatif des modèles',
      'Cas d\'usage par métier',
      'Argumentez les ventes'
    ],
    benefits: [
      'Certification Produit INGCO',
      'Guide technique imprimé',
      'Accès espace revendeur'
    ]
  },
  {
    id: 'technique',
    title: 'Formation Technique Avancée',
    icon: '🛠️',
    description: 'Apprenez à diagnostiquer et entretenir les outils électriques.',
    duration: '3 jours',
    level: 'Avancé',
    price: 'Inclus',
    videos: 8,
    articles: 12,
    pdfs: 5,
    program: [
      'Diagnostic des pannes courantes',
      'Maintenance préventive',
      'Remplacement des pièces',
      'Sécurité électrique',
      'Atelier pratique'
    ],
    benefits: [
      'Certification Technique',
      'Kit d\'outils de diagnostic',
      'Support technique prioritaire'
    ]
  },
  {
    id: 'vente',
    title: 'Formation Techniques de Vente',
    icon: '💼',
    description: 'Optimisez vos ventes avec des techniques éprouvées.',
    duration: '1 jour',
    level: 'Débutant',
    price: 'Inclus',
    program: [
      'Analyse des besoins client',
      'Présentation produit efficace',
      'Gestion des objections',
      'Upselling et cross-selling',
      'Fidélisation client'
    ],
    benefits: [
      'Certification Vente',
      'Guide des meilleures pratiques',
      'Suivi commercial personnalisé'
    ]
  },
  {
    id: 'digital',
    title: 'Formation Digital & E-commerce',
    icon: '📱',
    description: 'Apprenez à vendre en ligne et gérer votre présence digitale.',
    duration: '2 jours',
    level: 'Intermédiaire',
    price: 'Inclus',
    program: [
      'Créer votre boutique en ligne',
      'Référencement produits',
      'Gestion des commandes',
      'Marketing digital',
      'Service client digital'
    ],
    benefits: [
      'Certification Digital',
      'Template boutique',
      'Formation vidéo offerte'
    ]
  }
]

// FAQ
const faqs = [
  {
    question: 'Les formations sont-elles obligatoires?',
    answer: 'Non, les formations sont facultatives mais fortement recommandées. Elles vous aident à mieux servir vos clients et à augmenter vos ventes.'
  },
  {
    question: 'Où se déroulent les formations?',
    answer: 'Les formations peuvent se faire en présentiel (Cotonou) ou en visioconférence pour plus de flexibilité.'
  },
  {
    question: 'Quel est le coût des formations?',
    answer: 'Toutes les formations sont gratuites pour les revendeurs agréés E-Outilles.'
  },
  {
    question: 'Puis-je former mon équipe?',
    answer: 'Oui, vous pouvez former jusqu\'à 3 personnes de votre équipe par formation.'
  },
  {
    question: 'Les formations donnent-elles des certifications?',
    answer: 'Oui, chaque formation validée délivre une certification INGCO reconnue.'
  }
]

// Schedule
const schedule = [
  { month: 'Janvier', event: 'Formation Produits - Niveau 1' },
  { month: 'Février', event: 'Formation Technique Avancée' },
  { month: 'Mars', event: 'Formation Vente' },
  { month: 'Avril', event: 'Formation Produits - Niveau 2' },
  { month: 'Mai', event: 'Formation Digital' },
  { month: 'Juin', event: 'Formation Technique - Atelier' }
]

export default function FormationsPage() {
  const [expandedFormation, setExpandedFormation] = useState<string | null>(null)

  const toggleFormation = (id: string) => {
    setExpandedFormation(expandedFormation === id ? null : id)
  }

  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const showNotification = (message: string) => {
    console.log('Notification triggered:', message)
    // Show modal instead of alert - works better in all browsers
    setModalMessage(message)
    setShowModal(true)
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowModal(false)
    }, 3000)
  }

  const handleVideoClick = (videoTitle: string) => {
    const msg = `🎬 Vidéo: ${videoTitle} - Bientôt disponible!`
    console.log('Video clicked:', videoTitle)
    showNotification(msg)
  }

  const handleDownload = (resourceTitle: string) => {
    const msg = `📄 Document: ${resourceTitle} - Bientôt disponible!`
    console.log('Download clicked:', resourceTitle)
    showNotification(msg)
  }

  const handleArticleClick = (articleTitle: string) => {
    const msg = `📖 Article: ${articleTitle} - Bientôt disponible!`
    console.log('Article clicked:', articleTitle)
    showNotification(msg)
  }

  // TEST: Direct click handler for testing
  const testClick = () => {
    console.log('TEST CLICK WORKED!')
    // Direct DOM manipulation as backup
    const modal = document.getElementById('test-modal')
    if (modal) {
      modal.style.display = 'flex'
    }
    // Also try React state
    setModalMessage('🎉 YES! Ça marche! Cliquez pour fermer.')
    setShowModal(true)
  }

  // useEffect to detect hash changes (works reliably!)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#clicked') {
        // Show the modal
        const modal = document.getElementById('test-modal')
        if (modal) {
          modal.style.display = 'flex'
        }
        // Remove hash so it can be clicked again
        window.location.hash = ''
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* TEST LINK - Uses hash change (very reliable!) */}
      <div style={{position: 'fixed', top: '80px', right: '10px', zIndex: 9999}}>
        <a 
          href="#clicked"
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '15px 25px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '3px solid white',
            borderRadius: '10px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          🧪 TEST: Cliquer ici!
        </a>
      </div>

      {/* TEST MODAL - Direct DOM manipulation */}
      <div 
        id="test-modal" 
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}
        onClick={() => {
          document.getElementById('test-modal').style.display = 'none'
        }}
      >
        <div style={{
          backgroundColor: '#16a34a',
          color: 'white',
          padding: '50px 100px',
          borderRadius: '20px',
          fontSize: '36px',
          fontWeight: 'bold',
          border: '8px solid white',
          textAlign: 'center'
        }} id="modal-message">
          🎉 YES! Ça marche!<br/>
          <span style={{fontSize: '20px'}}>(Cliquez pour fermer)</span>
        </div>
      </div>

      {/* Modal Popup - shows immediately on click */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div 
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '40px 80px',
              borderRadius: '20px',
              fontSize: '32px',
              fontWeight: 'bold',
              border: '6px solid white',
              boxShadow: '0 0 50px rgba(22, 163, 74, 1)',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            {modalMessage}
            <div style={{fontSize: '16px', marginTop: '20px', opacity: 0.8}}>
              (Cliquez pour fermer)
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="horizontal" size={40} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-ingco-yellow transition-colors">Accueil</Link>
              <Link href="/categories" className="text-gray-300 hover:text-ingco-yellow transition-colors">Catégories</Link>
              <Link href="/revendeurs" className="text-gray-300 hover:text-ingco-yellow transition-colors">Revendeurs</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">🛒</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-ingco-gray to-ingco-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Formations <span className="text-ingco-yellow">Revendeurs</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Développez vos compétences et celles de votre équipe avec nos formations professionnelles. 
            Tout inclus pour les revendeurs agréés E-Outilles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#formations" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Découvrir les Formations
            </Link>
            <Link href="/revendeurs" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              Devenir Revendeur
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-ingco-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">4</div>
              <div className="text-gray-400">Formations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">8</div>
              <div className="text-gray-400">Jours de formation</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">100%</div>
              <div className="text-gray-400">Certifications</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">Gratuit</div>
              <div className="text-gray-400">Pour revendeurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section id="formations" className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nos Formations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formations.map((formation) => (
              <div key={formation.id} className="bg-ingco-gray rounded-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{formation.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{formation.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <span>⏱️ {formation.duration}</span>
                        <span>📊 {formation.level}</span>
                        <span>💰 {formation.price}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6">{formation.description}</p>
                  
                  <button
                    onClick={() => toggleFormation(formation.id)}
                    className="text-ingco-yellow font-semibold hover:underline"
                  >
                    {expandedFormation === formation.id ? '▼ Masquer le programme' : '▶ Voir le programme'}
                  </button>

                  {expandedFormation === formation.id && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="font-bold text-white mb-3">Programme:</h4>
                      <ul className="space-y-2 mb-6">
                        {formation.program.map((item, i) => (
                          <li key={i} className="text-gray-400 flex items-center gap-2">
                            <span className="text-ingco-yellow">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-bold text-white mb-3">Avantages:</h4>
                      <ul className="space-y-2">
                        {formation.benefits.map((benefit, i) => (
                          <li key={i} className="text-gray-400 flex items-center gap-2">
                            <span className="text-green-500">★</span> {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Calendrier des Formations 2026
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Planifiez votre année de formation
          </p>
          <div className="bg-ingco-black rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-ingco-gray rounded-xl">
                  <div className="text-ingco-yellow font-bold w-28">{item.month}</div>
                  <div className="text-white">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modules */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            🎥 Vidéos de Formation
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Apprenez à utiliser les produits INGCO grâce à nos tutoriels vidéo
          </p>
          
          {videoModules.map((module, index) => (
            <div key={index} className="mb-12">
              <h3 className="text-xl font-bold text-ingco-yellow mb-4">{module.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {module.videos.map((video, vIndex) => (
                  <a
                    key={vIndex}
                    href={`#video-${encodeURIComponent(video.title)}`}
                    className="block bg-ingco-gray rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer text-left w-full"
                    onClick={(e) => {
                      e.preventDefault()
                      const modal = document.getElementById('test-modal')
                      if (modal) {
                        document.getElementById('modal-message').textContent = `🎬 Vidéo: ${video.title} - Bientôt disponible!`
                        modal.style.display = 'flex'
                      }
                      window.location.hash = ''
                    }}
                  >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-40 flex items-center justify-center">
                      <div className="text-6xl">{video.thumbnail}</div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-2">{video.title}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>▶</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <button 
              onClick={() => handleVideoClick('Toutes les vidéos')}
              className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Voir toutes les vidéos
            </button>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            📚 Ressources PDF à Télécharger
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Guides techniques, catalogues et fiches produit
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writtenResources.map((resource, index) => (
              <div key={index} className="bg-ingco-black rounded-xl p-6 hover:border-ingco-yellow border-2 border-transparent transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <h4 className="text-white font-bold mb-2">{resource.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                      <span className="bg-ingco-gray px-2 py-1 rounded">{resource.type}</span>
                      <span>{resource.pages} pages</span>
                    </div>
                    <button 
                      onClick={() => handleDownload(resource.title)}
                      className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2"
                    >
                      <span>⬇️</span> Télécharger
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Written Articles */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            📖 Articles & Tutoriels
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Des contenus détaillés pour approfondir vos connaissances
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🔧</span>
                <div>
                  <h4 className="text-white font-bold">Bien choisir sa perceuse visseuse</h4>
                  <span className="text-gray-400 text-sm">Outils Électriques</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Guide complet pour choisir le bon outil selon vos besoins...
              </p>
              <button onClick={() => handleArticleClick('Bien choisir sa perceuse visseuse')} className="text-ingco-yellow font-semibold hover:underline">Lire la suite →</button>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🔋</span>
                <div>
                  <h4 className="text-white font-bold">Entretien des batteries lithium-ion</h4>
                  <span className="text-gray-400 text-sm">Outils Sans Fil</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Astuces et bonnes pratiques pour prolonger la durée de vie...
              </p>
              <button onClick={() => handleArticleClick('Entretien des batteries lithium-ion')} className="text-ingco-yellow font-semibold hover:underline">Lire la suite →</button>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🦺</span>
                <div>
                  <h4 className="text-white font-bold">Sécurité sur les chantier</h4>
                  <span className="text-gray-400 text-sm">Sécurité</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Checklist complète des équipements de protection obligatoire...
              </p>
              <button onClick={() => handleArticleClick('Sécurité sur les chantiers')} className="text-ingco-yellow font-semibold hover:underline">Lire la suite →</button>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">🌿</span>
                <div>
                  <h4 className="text-white font-bold">Guide d'achat tronçonneuse</h4>
                  <span className="text-gray-400 text-sm">Jardinage</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Comparatif des meilleures tronçonneuses pour professionnel...
              </p>
              <button onClick={() => handleArticleClick('Guide d\'achat tronçonneuse')} className="text-ingco-yellow font-semibold hover:underline">Lire la suite →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pourquoi se former?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">Augmentez vos Ventes</h3>
              <p className="text-gray-400">
                Un revendeur formé conseil mieux ses clients et augmente son chiffre d'affaires.
              </p>
            </div>
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-3">Gagnez en Credibilité</h3>
              <p className="text-gray-400">
                La certification INGCO rassure vos clients et différencie votre magasin.
              </p>
            </div>
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-3">Support Prioritaire</h3>
              <p className="text-gray-400">
                Accédez au support technique dédié et résolvez les problèmes rapidement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-ingco-black rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à vous former?
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez notre programme de formation et devenez un expert INGCO
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/revendeurs" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Devenir Revendeur
            </Link>
            <Link href="/contact" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ingco-gray py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Outilles By ELECTRON. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
