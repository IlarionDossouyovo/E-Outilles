'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Categories data
const demoCategories = [
  { 
    id: 'construction', 
    name: 'Construction & BTP', 
    icon: '🏗️',
    description: 'Outils pour le bâtiment et travaux publics',
    slug: 'construction',
    color: 'bg-orange-500'
  },
  { 
    id: 'electricite', 
    name: 'Électricité', 
    icon: '⚡',
    description: 'Matériel électrique professionnel',
    slug: 'electricite',
    color: 'bg-yellow-500'
  },
  { 
    id: 'garage', 
    name: 'Garage Auto', 
    icon: '🚗',
    description: 'Équipement garage et automobile',
    slug: 'garage',
    color: 'bg-teal-500'
  },
  { 
    id: 'jardinage', 
    name: 'Jardinage', 
    icon: '🌿',
    description: 'Outils pour le jardin',
    slug: 'jardinage',
    color: 'bg-green-500'
  }
]

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState('construction')

  const currentCategory = demoCategories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="horizontal" size={40} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-ingco-yellow transition-colors">Accueil</Link>
              <Link href="/categories" className="text-ingco-yellow font-semibold">Catégories</Link>
              <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
              <Link href="/chat" className="text-gray-300 hover:text-ingco-yellow transition-colors">Assistant</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">🛒</Link>
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
          {demoCategories.map((cat) => (
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

      {/* Category Info */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{currentCategory?.icon}</span>
            {currentCategory?.name}
          </h2>
          <p className="text-gray-400">{currentCategory?.description}</p>
        </div>

        {/* Link to products */}
        <Link 
          href={`/search?category=${currentCategory?.slug}`}
          className="inline-flex items-center gap-2 bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
        >
          Voir tous les produits {currentCategory?.icon} →
        </Link>
      </section>

      {/* All Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="bg-ingco-gray rounded-2xl p-8 text-center hover:bg-gray-700 transition-all group"
            >
              <div className="text-6xl mb-4">{cat.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-ingco-yellow transition-colors">
                {cat.name}
              </h3>
              <p className="text-gray-400 text-sm">{cat.description}</p>
            </Link>
          ))}
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