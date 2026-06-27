'use client'

import { useState } from 'react'
import Link from 'next/link'

const services = [
  {
    id: 'consultation',
    name: 'Consultation Technique',
    icon: '📋',
    description: 'Conseils experts pour vos projets',
    price: 'Gratuit',
    duration: '30 min',
    features: [
      'Analyse de vos besoins',
      'Recommandations personnalisees',
      'Devis detaille gratuit',
      'Suivi personnalise',
    ]
  },
  {
    id: 'installation',
    name: 'Installation & Montage',
    icon: '🔧',
    description: 'Installation professionnelle de vos equipements',
    price: 'A partir de 50€',
    duration: 'Selon projet',
    features: [
      'Installation a domicile',
      'Montage professionnel',
      'Mise en service',
      'Formation utilisateur',
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Reparation',
    icon: '🔩',
    description: 'Entretien et reparation de vos outils',
    price: 'A partir de 30€',
    duration: '24-48h',
    features: [
      'Diagnostic gratuit',
      'Pieces authentiques',
      'Garantie 6 mois',
      'Service rapide',
    ]
  },
  {
    id: 'livraison',
    name: 'Livraison a Domicile',
    icon: '🚚',
    description: 'Livraison rapide dans tout le Benin',
    price: 'A partir de 5€',
    duration: '24-72h',
    features: [
      'Livraison partout au Benin',
      'Suivi en temps reel',
      'Emballage securise',
      'Assurance incluse',
    ]
  },
  {
    id: 'formation',
    name: 'Formation Utilisation',
    icon: '📚',
    description: 'Apprenez a utiliser vos outils',
    price: 'A partir de 25€',
    duration: '2-4 heures',
    features: [
      'Formation sur mesure',
      'Support de cours',
      'Attestation',
      'Mise a niveau gratuite',
    ]
  },
  {
    id: 'location',
    name: 'Location de Materiel',
    icon: '🔑',
    description: 'Louez vos outils pour vos projets',
    price: 'A partir de 10€/jour',
    duration: 'Flexible',
    features: [
      'Large choix de materiel',
      'Assurance incluse',
      'Livraison possible',
      'Prix deduits achat',
    ]
  },
]

const testimonials = [
  { name: 'Jean K.', text: 'Excellent service! Mon atelier est maintenant equipe.', rating: 5 },
  { name: 'Marie D.', text: 'Livraison rapide et personnel tres competent.', rating: 5 },
  { name: 'Paul O.', text: 'La maintenance m a fait economiser beaucoup.', rating: 5 },
]

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(services[0])

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
                <span className="text-ingco-black font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-xl">
                E-<span className="text-ingco-yellow">Outilles</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-ingco-yellow transition-colors">Accueil</Link>
              <Link href="/services" className="text-ingco-yellow font-semibold">Services</Link>
              <Link href="/categories" className="text-gray-300 hover:text-ingco-yellow transition-colors">Categories</Link>
              <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
              <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow transition-colors">Contact</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">Panier</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-ingco-gray to-ingco-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nos Services Professionnels
          </h1>
          <p className="text-gray-400 text-lg">
            Des services completes pour accompagner tous vos projets
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service)}
              className={`bg-ingco-gray rounded-xl p-6 text-left transition-all cursor-pointer hover:bg-ingco-yellow/20 hover:scale-105 ${
                activeService.id === service.id ? 'ring-2 ring-ingco-yellow bg-ingco-yellow/10' : ''
              }`}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-ingco-yellow font-bold">{service.price}</span>
                <span className="text-gray-500 text-sm">{service.duration}</span>
              </div>
              {activeService.id === service.id && (
                <div className="mt-4 text-center text-ingco-yellow text-sm animate-pulse">
                  ← Cliquez pour voir les details
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Service Details */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{activeService.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{activeService.name}</h2>
              <p className="text-gray-400">{activeService.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Inclus dans le service :</h3>
              <ul className="space-y-3">
                {activeService.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ingco-black rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Informations :</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Prix</span>
                  <p className="text-ingco-yellow font-bold text-xl">{activeService.price}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Duree</span>
                  <p className="text-white">{activeService.duration}</p>
                </div>
                <button className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-lg font-bold hover:bg-white transition-colors">
                  Commander ce service
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Temoignages Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-ingco-gray rounded-xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-ingco-yellow">⭐</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <p className="text-white font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-ingco-yellow to-yellow-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-ingco-black mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-gray-800 mb-6">
            Nos experts sont disponibles pour vous conseiller
          </p>
          <Link
            href="/contact"
            className="inline-block bg-ingco-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ingco-gray py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Outilles. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  )
}