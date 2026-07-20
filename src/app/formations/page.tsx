'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

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

  return (
    <div className="min-h-screen bg-ingco-black">
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
            Tout Inglclus pour les revendeurs agréés E-Outilles.
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
