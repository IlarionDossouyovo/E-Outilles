'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'
import Logo from '@/components/Logo'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi du formulaire
    setSubmitted(true)
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
              <Link href="/about" className="text-gray-300 hover:text-ingco-yellow transition-colors">À propos</Link>
              <Link href="/contact" className="text-ingco-yellow font-semibold">Contact</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">Panier</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-7xl mx-auto px-4">
        <PageNavigation />
      </div>

      {/* Hero Section */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Contactez-</span>
              <span className="text-ingco-yellow">nous</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Une question? Notre équipe est là pour vous aider
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">contact@eoutilles.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                    <p className="text-gray-400">+229 01 977 003 47</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Zone de service</h3>
                    <p className="text-gray-400">Cotonou, Benin</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ingco-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Horaires</h3>
                    <p className="text-gray-400">Lun-Ven: 9h-18h (GMT)</p>
                  </div>
                </div>
              </div>

              {/* FAQ rapide */}
              <div className="mt-12 p-6 bg-ingco-dark rounded-2xl">
                <h3 className="text-white font-bold mb-4">Questions Fréquentes</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-ingco-yellow font-semibold">Comment devenir revendeur?</p>
                    <p className="text-gray-400">Créez un compte et completes votre profil</p>
                  </div>
                  <div>
                    <p className="text-ingco-yellow font-semibold">Quels sont les délais?</p>
                    <p className="text-gray-400">Livraison en 7-14 jours selon la zone</p>
                  </div>
                  <div>
                    <p className="text-ingco-yellow font-semibold">Comment sont calculées les marges?</p>
                    <p className="text-gray-400">30-50% selon les produits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="bg-ingco-dark rounded-3xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Message envoyé!</h2>
                  <p className="text-gray-400 mb-8">Nous vous répondrons sous 24h</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-ingco-yellow hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-8">Envoyez-nous un message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="Votre nom"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Sujet</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                      >
                        <option value="">Choisir un sujet</option>
                        <option value="partnership">Devenir revendeur</option>
                        <option value="order">Question sur une commande</option>
                        <option value="product">Question produit</option>
                        <option value="payment">Problème de paiement</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-gray rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none resize-none"
                        placeholder="Votre message..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all"
                    >
                      Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ingco-black border-t border-ingco-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 E-Outilles. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="text-gray-500 hover:text-ingco-yellow">Accueil</Link>
              <Link href="/about" className="text-gray-500 hover:text-ingco-yellow">À propos</Link>
              <Link href="/contact" className="text-ingco-yellow">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}