'use client'

import { useState } from 'react'
import { NavigationArrows, Icon } from '@/components/Icons'
import Reveal from '@/components/Reveal'
import Link from 'next/link'

// Données des avantages revendeur
const advantages = [
  {
    icon: 'star',
    title: 'Marges Avantageuses',
    description: 'Profitez de tarifs préférentiels et de marges attractives sur tous les produits INGCO.'
  },
  {
    icon: 'truck',
    title: 'Stock Garanti',
    description: 'Approvisionnement prioritaire et stocks garantis toute l\'année.'
  },
  {
    icon: 'check',
    title: 'Support Marketing',
    description: 'Aides promotionnelles, PLV, et supports publicitaires exclusifs.'
  },
  {
    icon: 'tools',
    title: 'Formation Technique',
    description: 'Accès aux formations produits et support technique exclusif.'
  },
  {
    icon: 'truck',
    title: 'Livraison Prioritaire',
    description: 'Livraison rapide et gratuite pour les commandes revendeur.'
  },
  {
    icon: 'user',
    title: 'Partenariat Long Terme',
    description: 'Contrat de partenariat avantageux et suivi personnalisé.'
  }
]

// Catégories de produits disponibles
const productCategories = [
  'Outils Électriques',
  'Outils Sans Fil',
  'Outils à Main',
  'Outils à Air',
  'Mesure & Niveau',
  'Jardinage',
  'Automobile',
  'Forage & Découpe',
  'Soudeuse & Welding',
  'Générateurs',
  'Construction',
  'Pompes & Eau',
  'Sécurité',
  'Rangement',
  'Accessoires'
]

// Questions fréquentes
const faqs = [
  {
    question: 'Comment devenir revendeur officiel E-Outilles?',
    answer: 'Remplissez le formulaire de contact en sélectionnant "Devenir revendeur". Notre équipe commerciale vous contactera sous 48h.'
  },
  {
    question: 'Quel est le minimum de commande?',
    answer: 'Le montant minimum de commande est de 500€ pour les revendeurs agréés.'
  },
  {
    question: 'Quels sont les délais de livraison?',
    answer: 'Les livraisons sont effectuées sous 3-5 jours ouvrés pour les commandes passées avant 14h.'
  },
  {
    question: 'Puis-je obtenir des échantillons?',
    answer: 'Oui, nous proposons des tarifs préférentiels pour les échantillons destined à la démonstration en magasin.'
  },
  {
    question: 'Quel support technique est disponible?',
    answer: 'Vous aurez accès à notre équipe technique dédiée, aux formations produit et à une documentation complète.'
  }
]

export default function RevendeursPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Bénin',
    categories: [] as string[],
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/resellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.companyName,
          name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          message: formData.message,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Erreur lors de l'envoi de la demande")
        return
      }

      setSubmitted(true)
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-ingco-gray to-ingco-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="animate-fade-in-up text-4xl md:text-5xl font-bold text-white mb-6">
            Devenez Revendeur <span className="text-ingco-yellow">E-Outilles</span>
          </h1>
          <p className="animate-fade-in-up stagger-1 text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Rejoignez le réseau de revendeurs officiels INGCO au Benin. 
            Accédez à des tarifs préférentiels, un support exclusif et grow votre activité.
          </p>
          <div className="animate-fade-in-up stagger-2 flex flex-wrap justify-center gap-4">
            <Link href="#register" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Devenir Revendeur
            </Link>
            <Link href="#advantages" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              Découvrir les Avantages
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section id="advantages" className="py-16 bg-ingco-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Pourquoi devenir revendeur?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, index) => (
              <div key={index} className="bg-ingco-gray rounded-2xl p-8 hover:bg-gray-700 transition-colors">
                <Icon name={adv.icon as never} className="w-11 h-11 text-ingco-yellow mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{adv.title}</h3>
                <p className="text-gray-400">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories de produits */}
      <section className="py-16 bg-ingco-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            15 Catégories de Produits
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Toute la gamme INGCO disponible pour vos clients
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCategories.map((cat, index) => (
              <div key={index} className="bg-ingco-black rounded-xl p-4 text-center">
                <span className="text-ingco-yellow font-semibold text-sm">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire d'inscription */}
      <section id="register" className="py-16 bg-ingco-black">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Demande de Partenariat
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Remplissez ce formulaire et notre équipe vous contactera sous 48h
          </p>

          {submitted ? (
            <div className="bg-green-900/50 border border-green-500 rounded-2xl p-8 text-center">
              <Icon name="check" className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Demande Envoyée!</h3>
              <p className="text-gray-400">
                Merci pour votre intérêt. Notre équipe commerciale vous contactera sous 48h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-ingco-gray rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 mb-2">Nom de l'entreprise *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="E-Outilles SARL"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Nom du contact *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="Jean DOSSOU"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="contact@entreprise.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="+229 00 00 00 00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="Rue, Quartier"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                    placeholder="Cotonou, Porto-Novo..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 mb-3">Catégories d'intérêt</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {productCategories.slice(0, 9).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        formData.categories.includes(cat)
                          ? 'bg-ingco-yellow text-ingco-black font-semibold'
                          : 'bg-ingco-black text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Message (optionnel)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full bg-ingco-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                  placeholder="Parlez-nous de votre activité..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Envoi...' : 'Envoyer ma Demande'}
              </button>
              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </form>
          )}
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

      {/* Contact CTA */}
      <section className="py-16 bg-ingco-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous avez des questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Notre équipe commerciale est disponible pour répondre à toutes vos questions
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/formations" className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Voir les Formations
            </Link>
            <Link href="/contact" className="bg-ingco-gray text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/revendeurs" />
      </div>

    </div>
  )
}
