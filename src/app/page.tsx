'use client'

import { useState } from 'react'

// Données des catégories par métier
const categories = [
  {
    id: 'construction',
    name: 'Construction & BTP',
    icon: '🏗️',
    products: ['Perceuses', 'Marteaux perforateurs', 'Meuleuses'],
    blog: 'Top outils chantier 2026',
    description: 'Outils professionnels pour le BTP',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'electricite',
    name: 'Électricité',
    icon: '⚡',
    products: ['Multimètres', 'Testeurs', 'Pinces isolées'],
    blog: 'Sécurité électrique pro',
    description: 'Équipements pour installations électriques',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'garage',
    name: 'Garage Auto',
    icon: '🚗',
    products: ['Clés mécaniques', 'Cric hydraulique', 'Compresseurs'],
    blog: 'Équipement garage louable',
    description: 'Outillage garage automobile',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'jardinage',
    name: 'Jardinage',
    icon: '🌱',
    products: ['Tondeuses', 'Tronçonneuses', 'Systèmes arrosage'],
    blog: 'Créer un business jardinage',
    description: 'Équipement pour landscaping pro',
    color: 'from-green-500 to-green-700'
  }
]

// Produits vedettes
const featuredProducts = [
  { id: 1, name: 'Perceuse visseuse INGCO 20V', price: 89.99, image: '🔩', category: 'construction' },
  { id: 2, name: 'Marteau perforateur SDS Max 1500W', price: 249.99, image: '⚒️', category: 'construction' },
  { id: 3, name: 'Multimètre digital professionnel', price: 59.99, image: '📊', category: 'electricite' },
  { id: 4, name: 'Kit clés mécaniciennes 50pcs', price: 79.99, image: '🔧', category: 'garage' },
  { id: 5, name: 'Tondeuse thermique pro 160cc', price: 399.99, image: '🌿', category: 'jardinage' },
  { id: 6, name: 'Tronçonneuse thermique 45cm', price: 299.99, image: '🪚', category: 'jardinage' },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
                <span className="text-ingco-black font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-xl">
                E-<span className="text-ingco-yellow">Outilles</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#categories" className="text-gray-300 hover:text-ingco-yellow transition-colors">Catégories</a>
              <a href="#products" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</a>
              <a href="#about" className="text-gray-300 hover:text-ingco-yellow transition-colors">À propos</a>
              <a href="#contact" className="text-gray-300 hover:text-ingco-yellow transition-colors">Contact</a>
              <button className="bg-ingco-yellow text-ingco-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                Commander
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-ingco-dark border-t border-ingco-gray">
            <div className="px-4 py-4 space-y-3">
              <a href="#categories" className="block text-gray-300 hover:text-ingco-yellow">Catégories</a>
              <a href="#products" className="block text-gray-300 hover:text-ingco-yellow">Produits</a>
              <a href="#about" className="block text-gray-300 hover:text-ingco-yellow">À propos</a>
              <a href="#contact" className="block text-gray-300 hover:text-ingco-yellow">Contact</a>
              <button className="w-full bg-ingco-yellow text-ingco-black px-5 py-2 rounded-lg font-semibold">
                Commander
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              #FFC400 10px,
              #FFC400 11px
            )`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-ingco-gray/50 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-ingco-yellow rounded-full animate-pulse"></span>
              <span className="text-gray-300 text-sm">Distribution officielle INGCO</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">L'outillage </span>
              <span className="text-ingco-yellow text-shadow-glow">professionnel</span>
              <br />
              <span className="text-white">accessible à tous</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Votre partenaire dropshipping international pour outillage professionnel.
              Qualité INGCO, livraison mondiale, prix fabricant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-ingco-yellow/30">
                Découvrir le catalogue
              </button>
              <button className="border border-ingco-gray text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-ingco-yellow hover:text-ingco-yellow transition-all">
                Devenir revendeur
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">500+</div>
                <div className="text-gray-500 text-sm">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">50+</div>
                <div className="text-gray-500 text-sm">Pays livrés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">24h</div>
                <div className="text-gray-500 text-sm">Livraison</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-ingco-yellow">100%</div>
                <div className="text-gray-500 text-sm">Satisfait ou remboursé</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24 bg-ingco-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Parcourir par </span>
              <span className="text-ingco-yellow">métier</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des solutions spécialisées pour chaque secteur d'activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="group bg-ingco-gray rounded-2xl p-6 hover:bg-ingco-gray/80 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-ingco-yellow/10 cursor-pointer"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-ingco-yellow transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{category.description}</p>
                
                <div className="border-t border-ingco-dark pt-4">
                  <p className="text-xs text-gray-500 mb-2">Produits clés:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.products.slice(0, 3).map((product, idx) => (
                      <span key={idx} className="text-xs bg-ingco-dark px-2 py-1 rounded text-gray-400">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-ingco-yellow text-sm">
                  <span>Blog: {category.blog}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Produits </span>
              <span className="text-ingco-yellow">vedettes</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Les meilleures ventes de notre catalogue professionnel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-ingco-gray rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ingco-yellow/10 transition-all hover:-translate-y-2 group"
              >
                <div className="h-48 bg-ingco-dark flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                <div className="p-6">
                  <div className="text-xs text-ingco-yellow mb-2 uppercase tracking-wide">
                    {categories.find(c => c.id === product.category)?.name}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ingco-yellow">{product.price}€</span>
                    <button className="bg-ingco-yellow text-ingco-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border border-ingco-yellow text-ingco-yellow px-8 py-3 rounded-xl font-semibold hover:bg-ingco-yellow hover:text-ingco-black transition-all">
              Voir tous les produits
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-ingco-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-ingco-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dropshipping mondial</h3>
              <p className="text-gray-400">Livraison directe depuis nos entrepôts vers vos clients, sans stock.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-ingco-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">IA Marketing</h3>
              <p className="text-gray-400">Automatisation intelligente pour vos campagnes publicitaires et SEO.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-ingco-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Paiements locaux</h3>
              <p className="text-gray-400">MTN, Moov, Orange, Flutterwave - Paiements adaptés à votre pays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ingco-yellow/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-ingco-gray rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Prêt à démarrer votre </span>
              <span className="text-ingco-yellow">activité dropshipping?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Rejoignez notre réseau de revendeurs et accédez à des marges avantageuses,
              un catalogue de 500+ produits et un support client dédié.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-105">
                Créer mon compte revendeur
              </button>
              <button className="border border-ingco-gray text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-ingco-yellow hover:text-ingco-yellow transition-all">
                Me connecter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ingco-dark border-t border-ingco-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
                  <span className="text-ingco-black font-bold text-xl">E</span>
                </div>
                <span className="text-white font-bold text-xl">
                  E-<span className="text-ingco-yellow">Outilles</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Votre partenaire dropshipping international pour outillage professionnel INGCO.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Catégories</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Construction & BTP</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Électricité</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Garage Auto</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Jardinage</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Devenir revendeur</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-ingco-yellow transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Paiements</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">Visa</span>
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">Mastercard</span>
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">PayPal</span>
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">MTN</span>
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">Orange</span>
                <span className="bg-ingco-gray px-3 py-1 rounded text-xs text-gray-400">Flutterwave</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-ingco-gray pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 E-Outilles. Tous droits réservés. Projet dropshipping INGCO.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-ingco-yellow transition-colors">Mentions légales</a>
              <a href="#" className="text-gray-500 hover:text-ingco-yellow transition-colors">RGPD</a>
              <a href="#" className="text-gray-500 hover:text-ingco-yellow transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}