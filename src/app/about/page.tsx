'use client'

import Link from 'next/link'
import PageNavigation from '@/components/PageNavigation'

export default function About() {
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
              <Link href="/about" className="text-ingco-yellow font-semibold">À propos</Link>
              <Link href="/contact" className="text-gray-300 hover:text-ingco-yellow transition-colors">Contact</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">Panier</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-7xl mx-auto px-4">
        <PageNavigation />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">À propos de </span>
              <span className="text-ingco-yellow">E-Outilles</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Votre partenaire dropshipping international pour outillage professionnel INGCO
            </p>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-ingco-dark rounded-3xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-4">Notre Mission</h2>
              <p className="text-gray-400">
                Permettre aux entrepreneurs Africans d'accéder à des outils professionnels de qualité 
                sans investir dans un stock initial. Nous simplifions le commerce international 
                avec une solution dropshipping clés en main.
              </p>
            </div>
            <div className="bg-ingco-dark rounded-3xl p-8">
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-2xl font-bold text-white mb-4">Notre Vision</h2>
              <p className="text-gray-400">
                Devenir la plateforme de référence pour le dropshipping d'outils 
                professionnels en Afrique francophone. Nous connectons les fabricants 
                aux revendeurs locaux via une chaîne logistique optimisée.
              </p>
            </div>
          </div>

          {/* Chiffres clés */}
          <div className="bg-ingco-gray rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">E-Outilles en chiffres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">500+</div>
                <div className="text-gray-500">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">50+</div>
                <div className="text-gray-500">Pays livrés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">200+</div>
                <div className="text-gray-500">Revendeurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">24h</div>
                <div className="text-gray-500">Livraison moy.</div>
              </div>
            </div>
          </div>

          {/* Partenaires */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Nos Partenaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-ingco-dark rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-ingco-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <h3 className="text-white font-semibold mb-2">INGCO</h3>
                <p className="text-gray-500 text-sm">Fabricant officiel</p>
              </div>
              <div className="bg-ingco-dark rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-ingco-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Stripe</h3>
                <p className="text-gray-500 text-sm">Paiement sécurisé</p>
              </div>
              <div className="bg-ingco-dark rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-ingco-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-white font-semibold mb-2">DHL/FedEx</h3>
                <p className="text-gray-500 text-sm">Logistique mondiale</p>
              </div>
            </div>
          </div>

          {/* Valeurs */}
          <div className="bg-gradient-to-r from-ingco-yellow/20 to-transparent rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h3 className="text-white font-semibold">Confiance</h3>
                <p className="text-gray-500 text-sm">Relations durables</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-white font-semibold">Rapiditié</h3>
                <p className="text-gray-500 text-sm">Livraison express</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-white font-semibold">Qualité</h3>
                <p className="text-gray-500 text-sm">Produits certifiés</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-white font-semibold">Prix justes</h3>
                <p className="text-gray-500 text-sm">Marges optimales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ingco-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Prêt à démarrer?</h2>
          <p className="text-gray-400 mb-8">Rejoignez notre réseau de revendeurs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all">
              Créer mon compte
            </Link>
            <Link href="/contact" className="border border-ingco-gray text-white px-8 py-4 rounded-xl font-bold hover:border-ingco-yellow hover:text-ingco-yellow transition-all">
              Nous contacter
            </Link>
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
              <Link href="/about" className="text-ingco-yellow">À propos</Link>
              <Link href="/contact" className="text-gray-500 hover:text-ingco-yellow">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}