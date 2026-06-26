'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [step, setStep] = useState(1) // 1: livraison, 2: paiement, 3: confirmation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Benin',
    note: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Simuler la commande
      clearCart()
    }
  }

  // Navigation
  const Nav = () => (
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
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
          </div>
        </div>
      </div>
    </nav>
  )

  // Footer
  const Footer = () => (
    <footer className="bg-ingco-dark border-t border-ingco-gray py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">© 2026 E-Outilles. Tous droits réservés.</p>
      </div>
    </footer>
  )

  // Étape 3: Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen bg-ingco-black">
        <Nav />
        <div className="pt-24 pb-16 max-w-md mx-auto px-4 text-center">
          <div className="bg-ingco-gray rounded-3xl p-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Commande confirmée!</h1>
            <p className="text-gray-400 mb-6">
              Merci {formData.name}! Votre commande a été enregistrée. 
              Nous vous contacterons au {formData.phone} pour la livraison.
            </p>
            <div className="bg-ingco-dark rounded-xl p-4 mb-6 text-left">
              <p className="text-gray-400 text-sm">Résumé de commande:</p>
              <p className="text-white font-bold">{items.length} produit(s)</p>
              <p className="text-ingco-yellow font-bold text-xl">{getTotal().toFixed(2)}€</p>
            </div>
            <Link href="/" className="block bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400">
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black">
      <Nav />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-ingco-yellow' : 'text-gray-500'}`}>
            <span className="w-8 h-8 rounded-full bg-ingco-yellow/20 flex items-center justify-center">1</span>
            <span className="hidden sm:inline">Livraison</span>
          </div>
          <div className="w-8 h-0.5 bg-ingco-gray"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-ingco-yellow' : 'text-gray-500'}`}>
            <span className="w-8 h-8 rounded-full bg-ingco-yellow/20 flex items-center justify-center">2</span>
            <span className="hidden sm:inline">Paiement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-ingco-gray rounded-2xl p-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">Informations de livraison</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="+229 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Adresse *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        placeholder="Adresse de livraison"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Ville *</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                          placeholder="Cotonou"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Pays</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        >
                          <option value="Benin">Bénin</option>
                          <option value="SN">Sénégal</option>
                          <option value="CI">Côte d'Ivoire</option>
                          <option value="CM">Cameroun</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Note (optionnel)</label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                        className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                        rows={3}
                        placeholder="Instructions spéciales..."
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">Mode de paiement</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 bg-ingco-black rounded-xl cursor-pointer hover:bg-ingco-dark">
                      <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
                      <div>
                        <p className="text-white font-bold">Paiement à la livraison (COD)</p>
                        <p className="text-gray-400 text-sm">Payez lorsque vous recevez votre commande</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 bg-ingco-black rounded-xl cursor-pointer hover:bg-ingco-dark opacity-50">
                      <input type="radio" name="payment" disabled className="w-5 h-5" />
                      <div>
                        <p className="text-white font-bold">Mobile Money (bientôt)</p>
                        <p className="text-gray-400 text-sm">MTN, Moov, Orange</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 bg-ingco-black rounded-xl cursor-pointer hover:bg-ingco-dark opacity-50">
                      <input type="radio" name="payment" disabled className="w-5 h-5" />
                      <div>
                        <p className="text-white font-bold">Carte bancaire (bientôt)</p>
                        <p className="text-gray-400 text-sm">Visa, Mastercard</p>
                      </div>
                    </label>
                  </div>
                </>
              )}

              <button type="submit" className="w-full mt-6 bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                {step === 1 ? 'Continuer vers paiement' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-ingco-gray rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Résumé</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="text-white">{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ingco-dark pt-3 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span className="text-green-500">Gratuit</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-ingco-yellow">{getTotal().toFixed(2)}€</span>
              </div>
            </div>
            <Link href="/cart" className="block text-center text-ingco-yellow mt-4 text-sm hover:underline">
              ← Retour au panier
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}