'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { 
    id: 'construction', 
    name: 'Construction', 
    icon: '🏗️',
    description: 'Outils pour le строительство',
    products: [
      { id: '1', name: 'Perceuse visseuse INGCO 20V', price: 89.99, image: '🔩' },
      { id: '2', name: 'Marteau perforateur SDS Max 1500W', price: 249.99, image: '⚒️' },
      { id: '3', name: 'Meuleuse angulaire 125mm', price: 79.99, image: '⚙️' },
      { id: '4', name: 'Scie circulaire 1900W', price: 189.99, image: '🪚' },
      { id: '5', name: 'Ponceuse orbitale excentrique', price: 69.99, image: '📐' },
      { id: '6', name: 'Defonceuse professionnelle 1200W', price: 159.99, image: '🎯' },
    ]
  },
  { 
    id: 'electricite', 
    name: 'Électricité', 
    icon: '⚡',
    description: 'Matériel électrique',
    products: [
      { id: '7', name: 'Multimetre digital professionnel', price: 59.99, image: '📊' },
      { id: '8', name: 'Pinces isolees professionnelles', price: 45.99, image: '🔌' },
      { id: '9', name: 'Testeur de tension sans contact', price: 29.99, image: '📡' },
      { id: '10', name: 'CABLE A DENUDER AUTOMATIQUE', price: 35.99, image: '✂️' },
      { id: '11', name: 'Tournevis electrique', price: 49.99, image: '🔧' },
      { id: '12', name: 'Boite a outils electrique 120pcs', price: 119.99, image: '🧰' },
    ]
  },
  { 
    id: 'garage', 
    name: 'Garage', 
    icon: '🚗',
    description: 'Equipement garage',
    products: [
      { id: '13', name: 'Kit cles mecaniciennes 50pcs', price: 79.99, image: '🔧' },
      { id: '14', name: 'Cric hydraulique 3T', price: 149.99, image: '🚙' },
      { id: '15', name: 'Chandelles de garage 3T', price: 89.99, image: '🔩' },
      { id: '16', name: 'Servante d atelier 7 tiroirs', price: 299.99, image: '🗄️' },
      { id: '17', name: 'Presse hydraulique 20T', price: 449.99, image: '🏗️' },
      { id: '18', name: 'Compresseur silencieux 50L', price: 349.99, image: '💨' },
    ]
  },
  { 
    id: 'jardinage', 
    name: 'Jardinage', 
    icon: '🌿',
    description: 'Outils de jardin',
    products: [
      { id: '19', name: 'Tronconneuse thermique 45cm', price: 299.99, image: '🪓' },
      { id: '20', name: 'Tondeuse thermique autopropulsee', price: 449.99, image: '🌱' },
      { id: '21', name: 'Taille haie electrique 600W', price: 129.99, image: '🌳' },
      { id: '22', name: 'Souffleur de feuilles thermique', price: 199.99, image: '🍃' },
      { id: '23', name: 'Motobineuse thermique', price: 549.99, image: '🌾' },
      { id: '24', name: 'Systeme d irrigation automatique', price: 179.99, image: '💧' },
    ]
  },
]

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState('construction')

  const currentCategory = categories.find(c => c.id === activeCategory)

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
              <Link href="/categories" className="text-ingco-yellow font-semibold">Catégories</Link>
              <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
              <Link href="/about" className="text-gray-300 hover:text-ingco-yellow transition-colors">À propos</Link>
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
            Catégories de Produits
          </h1>
          <p className="text-gray-400 text-lg">
            Trouvez tous vos outils professionnels par catégorie
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-ingco-yellow text-ingco-black font-bold'
                  : 'bg-ingco-gray text-gray-300 hover:bg-ingco-gray/80'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{currentCategory?.icon}</span>
            {currentCategory?.name}
          </h2>
          <p className="text-gray-400">{currentCategory?.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory?.products.map((product) => (
            <Link
              key={product.id}
              href={`/produit-detail-page/${product.id}`}
              className="bg-ingco-gray rounded-xl p-6 hover:bg-ingco-gray/80 transition-all group"
            >
              <div className="text-6xl mb-4 text-center">{product.image}</div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-ingco-yellow transition-colors">
                {product.name}
              </h3>
              <div className="text-ingco-yellow font-bold text-xl">
                {product.price}€
              </div>
              <button className="mt-4 w-full bg-ingco-yellow text-ingco-black py-2 rounded-lg font-semibold hover:bg-white transition-colors">
                Voir details
              </button>
            </Link>
          ))}
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