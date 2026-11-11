'use client'

import { useState } from 'react'
import { NavigationArrows, Icon } from '@/components/Icons'
import Link from 'next/link'
import { LocalizedText } from '@/components/LocalizedText'

// Vidéos de formation par catégorie
const videoModules = [
  {
    category: 'Outils Électriques',
    videos: [
      { title: 'Comment utiliser une perceuse visseuse', duration: '5:30', thumbnail: 'tools' },
      { title: 'Guide meuleuse angulaire', duration: '7:15', thumbnail: 'settings' },
      { title: 'Marteau perforateur: Mode d\'emploi', duration: '10:45', thumbnail: 'tools' }
    ]
  },
  {
    category: 'Outils Sans Fil',
    videos: [
      { title: 'Bien choisir sa batterie 20V', duration: '4:20', thumbnail: 'zap' },
      { title: 'Entretien des batteries lithium-ion', duration: '6:00', thumbnail: 'zap' }
    ]
  },
  {
    category: 'Sécurité',
    videos: [
      { title: 'EPI obligatoires sur chantier', duration: '8:30', thumbnail: 'shield' },
      { title: 'Sécurité électrique: Les essentiels', duration: '12:15', thumbnail: 'zap' }
    ]
  },
  {
    category: 'Jardinage',
    videos: [
      { title: 'Entretien tronçonneuse', duration: '9:00', thumbnail: 'tools' },
      { title: 'Réglage tondeuse thermique', duration: '6:45', thumbnail: 'settings' }
    ]
  }
]

// Ressources écrites (Articles/Tutoriels). Titles/metadata come from the shared
// registry so the page and the PDF route (GET /api/formations/[slug]) stay in
// sync; the download link is always a real, generated PDF.
import { TRAINING_RESOURCES } from '@/lib/formations/resources'
const writtenResources = TRAINING_RESOURCES.map((r) => ({
  title: r.title,
  category: r.category,
  type: r.type,
  download: `/api/formations/${r.slug}`,
}))


// Données des formations
const formations = [
  {
    id: 'produits',
    title: 'Formation Produits INGCO',
    icon: 'tools',
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
    icon: 'wrench',
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
    icon: 'card',
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
    icon: 'phone',
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
    // Show modal instead of alert - works better in all browsers
    setModalMessage(message)
    setShowModal(true)
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowModal(false)
    }, 3000)
  }

  const handleVideoClick = (videoTitle: string) => {
    const msg = `Vidéo : ${videoTitle} - Bientôt disponible !`
    showNotification(msg)
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-ingco-gray to-ingco-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <LocalizedText text="Formations" /> <span className="text-ingco-yellow"><LocalizedText text="Revendeurs" /></span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            <LocalizedText text="Développez vos compétences et celles de votre équipe avec nos formations professionnelles." />
            {' '}<LocalizedText text="Tout inclus pour les revendeurs agréés E-Outilles." />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#formations" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              <LocalizedText text="Découvrir les Formations" />
            </Link>
            <Link href="/revendeurs" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              <LocalizedText text="Devenir Revendeur" />
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
              <div className="text-gray-400"><LocalizedText text="Formations" /></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">8</div>
              <div className="text-gray-400"><LocalizedText text="Jours de formation" /></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2">100%</div>
              <div className="text-gray-400"><LocalizedText text="Certifications" /></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-ingco-yellow mb-2"><LocalizedText text="Gratuit" /></div>
              <div className="text-gray-400"><LocalizedText text="Pour revendeurs" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Formations */}
      <section id="formations" className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            <LocalizedText text="Nos Formations" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formations.map((formation) => (
              <div key={formation.id} className="bg-ingco-gray rounded-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon name={formation.icon as never} className="w-12 h-12 text-ingco-yellow" />
                    <div>
                      <h3 className="text-xl font-bold text-white"><LocalizedText text={formation.title} /></h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Icon name="spinner" className="w-4 h-4" /> <LocalizedText text={formation.duration} /></span>
                        <span className="flex items-center gap-1"><Icon name="blog" className="w-4 h-4" /> <LocalizedText text={formation.level} /></span>
                        <span className="flex items-center gap-1"><Icon name="star" className="w-4 h-4" /> <LocalizedText text={formation.price} /></span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6"><LocalizedText text={formation.description} /></p>
                  
                  <button
                    onClick={() => toggleFormation(formation.id)}
                    className="text-ingco-yellow font-semibold hover:underline"
                  >
                    {expandedFormation === formation.id ? <LocalizedText text="▼ Masquer le programme" /> : <LocalizedText text="▶ Voir le programme" />}
                  </button>

                  {expandedFormation === formation.id && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="font-bold text-white mb-3"><LocalizedText text="Programme:" /></h4>
                      <ul className="space-y-2 mb-6">
                        {formation.program.map((item, i) => (
                          <li key={i} className="text-gray-400 flex items-center gap-2">
                            <Icon name="check" className="w-4 h-4 text-ingco-yellow shrink-0" /> <LocalizedText text={item} />
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-bold text-white mb-3"><LocalizedText text="Avantages:" /></h4>
                      <ul className="space-y-2">
                        {formation.benefits.map((benefit, i) => (
                          <li key={i} className="text-gray-400 flex items-center gap-2">
                            <Icon name="star" className="w-4 h-4 text-green-500 shrink-0" /> <LocalizedText text={benefit} />
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
            <LocalizedText text="Calendrier des Formations 2026" />
          </h2>
          <p className="text-gray-400 text-center mb-12">
            <LocalizedText text="Planifiez votre année de formation" />
          </p>
          <div className="bg-ingco-black rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-ingco-gray rounded-xl">
                  <div className="text-ingco-yellow font-bold w-28"><LocalizedText text={item.month} /></div>
                  <div className="text-white"><LocalizedText text={item.event} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modules */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4 flex items-center justify-center gap-3">
            <Icon name="chat" className="w-8 h-8 text-ingco-yellow" /> <LocalizedText text="Vidéos de Formation" />
          </h2>
          <p className="text-gray-400 text-center mb-12">
            <LocalizedText text="Apprenez à utiliser les produits INGCO grâce à nos tutoriels vidéo" />
          </p>
          
          {videoModules.map((module, index) => (
            <div key={index} className="mb-12">
              <h3 className="text-xl font-bold text-ingco-yellow mb-4"><LocalizedText text={module.category} /></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {module.videos.map((video, vIndex) => (
                  <a
                    key={vIndex}
                    href={`#video-${encodeURIComponent(video.title)}`}
                    className="block bg-ingco-gray rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer text-left w-full"
                    onClick={(e) => {
                      e.preventDefault()
                      handleVideoClick(video.title)
                    }}
                  >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-40 flex items-center justify-center">
                      <Icon name={video.thumbnail as never} className="w-14 h-14 text-ingco-yellow/80" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-2"><LocalizedText text={video.title} /></h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Icon name="chat" className="w-4 h-4" />
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
              <LocalizedText text="Voir toutes les vidéos" />
            </button>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4 flex items-center justify-center gap-3">
            <Icon name="download" className="w-8 h-8 text-ingco-yellow" /> <LocalizedText text="Ressources PDF à Télécharger" />
          </h2>
          <p className="text-gray-400 text-center mb-12">
            <LocalizedText text="Guides techniques, catalogues et fiches produit" />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writtenResources.map((resource, index) => (
              <div key={index} className="bg-ingco-black rounded-xl p-6 hover:border-ingco-yellow border-2 border-transparent transition-colors">
                <div className="flex items-start gap-4">
                  <Icon name="download" className="w-9 h-9 text-ingco-yellow" />
                  <div>
                    <h4 className="text-white font-bold mb-2"><LocalizedText text={resource.title} /></h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                      <span className="bg-ingco-gray px-2 py-1 rounded"><LocalizedText text={resource.type} /></span>
                      <span><LocalizedText text={resource.category} /></span>
                    </div>
                    <a
                      href={resource.download}
                      download
                      className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors flex items-center gap-2 w-fit"
                    >
                      <Icon name="download" className="w-4 h-4" /> <LocalizedText text="Télécharger" />
                    </a>
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
          <h2 className="text-3xl font-bold text-white text-center mb-4 flex items-center justify-center gap-3">
            <Icon name="blog" className="w-8 h-8 text-ingco-yellow" /> <LocalizedText text="Articles & Tutoriels" />
          </h2>
          <p className="text-gray-400 text-center mb-12">
            <LocalizedText text="Des contenus détaillés pour approfondir vos connaissances" />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="tools" className="w-8 h-8 text-ingco-yellow" />
                <div>
                  <h4 className="text-white font-bold"><LocalizedText text="Bien choisir sa perceuse visseuse" /></h4>
                  <span className="text-gray-400 text-sm"><LocalizedText text="Outils Électriques" /></span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                <LocalizedText text="Guide complet pour choisir le bon outil selon vos besoins..." />
              </p>
              <Link href="/blog/guide-outils-sans-fil-20v" className="text-ingco-yellow font-semibold hover:underline inline-flex items-center gap-1"><LocalizedText text="Lire la suite" /> <Icon name="arrow-right" className="w-4 h-4 inline" /></Link>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="zap" className="w-8 h-8 text-ingco-yellow" />
                <div>
                  <h4 className="text-white font-bold"><LocalizedText text="Entretien des batteries lithium-ion" /></h4>
                  <span className="text-gray-400 text-sm"><LocalizedText text="Outils Sans Fil" /></span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                <LocalizedText text="Astuces et bonnes pratiques pour prolonger la durée de vie..." />
              </p>
              <Link href="/blog/maintenance-preventive-outils" className="text-ingco-yellow font-semibold hover:underline inline-flex items-center gap-1"><LocalizedText text="Lire la suite" /> <Icon name="arrow-right" className="w-4 h-4 inline" /></Link>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="shield" className="w-8 h-8 text-ingco-yellow" />
                <div>
                  <h4 className="text-white font-bold"><LocalizedText text="Sécurité sur les chantier" /></h4>
                  <span className="text-gray-400 text-sm"><LocalizedText text="Sécurité" /></span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                <LocalizedText text="Checklist complète des équipements de protection obligatoire..." />
              </p>
              <Link href="/blog/epis-obligatoires-chantier" className="text-ingco-yellow font-semibold hover:underline inline-flex items-center gap-1"><LocalizedText text="Lire la suite" /> <Icon name="arrow-right" className="w-4 h-4 inline" /></Link>
            </div>
            
            <div className="bg-ingco-gray rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="tools" className="w-8 h-8 text-ingco-yellow" />
                <div>
                  <h4 className="text-white font-bold"><LocalizedText text="Guide d'achat tronçonneuse" /></h4>
                  <span className="text-gray-400 text-sm"><LocalizedText text="Jardinage" /></span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                <LocalizedText text="Comparatif des meilleures tronçonneuses pour professionnel..." />
              </p>
              <Link href="/blog/entretien-tronconneuse" className="text-ingco-yellow font-semibold hover:underline inline-flex items-center gap-1"><LocalizedText text="Lire la suite" /> <Icon name="arrow-right" className="w-4 h-4 inline" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            <LocalizedText text="Pourquoi se former?" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <Icon name="blog" className="w-12 h-12 text-ingco-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3"><LocalizedText text="Augmentez vos Ventes" /></h3>
              <p className="text-gray-400">
                <LocalizedText text="Un revendeur formé conseil mieux ses clients et augmente son chiffre d'affaires." />
              </p>
            </div>
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <Icon name="star" className="w-12 h-12 text-ingco-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3"><LocalizedText text="Gagnez en Credibilité" /></h3>
              <p className="text-gray-400">
                <LocalizedText text="La certification INGCO rassure vos clients et différencie votre magasin." />
              </p>
            </div>
            <div className="bg-ingco-gray rounded-2xl p-8 text-center">
              <Icon name="user" className="w-12 h-12 text-ingco-yellow mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3"><LocalizedText text="Support Prioritaire" /></h3>
              <p className="text-gray-400">
                <LocalizedText text="Accédez au support technique dédié et résolvez les problèmes rapidement." />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            <LocalizedText text="Questions Fréquentes" />
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-ingco-black rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2"><LocalizedText text={faq.question} /></h3>
                <p className="text-gray-400"><LocalizedText text={faq.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            <LocalizedText text="Prêt à vous former?" />
          </h2>
          <p className="text-gray-400 mb-8">
            <LocalizedText text="Rejoignez notre programme de formation et devenez un expert INGCO" />
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/revendeurs" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              <LocalizedText text="Devenir Revendeur" />
            </Link>
            <Link href="/contact" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              <LocalizedText text="Nous Contacter" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/formations" />
      </div>

      {showModal && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-2rem)]"
          role="status"
          aria-live="polite"
        >
          <div className="bg-ingco-gray border-2 border-ingco-yellow rounded-xl px-5 py-4 shadow-2xl flex items-start gap-3">
            <Icon name="chat" className="w-5 h-5 text-ingco-yellow shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">{modalMessage}</p>
              <Link href="/contact" className="text-ingco-yellow text-xs font-semibold hover:underline">
                <LocalizedText text="Nous contacter pour y accéder" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
