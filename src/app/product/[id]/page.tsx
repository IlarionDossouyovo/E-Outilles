'use client'

import { useState, use } from 'react'
import Link from 'next/link'

const products = [
  { id: '1', name: 'Perceuse visseuse INGCO 20V', price: 89.99, category: 'Construction', image: '🔩', description: 'Perceuse visseuse puissante 20V avec batterie longue duree. Idéale pour les travaux de construction.', features: ['20V lithium', '2 batteries', 'Chargeur rapide', 'Garantie 2 ans'], stock: 15 },
  { id: '2', name: 'Marteau perforateur SDS Max 1500W', price: 249.99, category: 'Construction', image: '⚒️', description: 'Marteau perforateur professionnel SDS Max 1500W. Puissant et durable pour les travaux lourds.', features: ['1500W', 'SDS Max', 'Variateur de vitesse', 'Garantie 3 ans'], stock: 8 },
  { id: '3', name: 'Meuleuse angulaire 125mm', price: 79.99, category: 'Construction', image: '⚙️', description: 'Meuleuse angulaire 125mm compacte et maniable. Parfaite pour la decoupe et le meulage.', features: ['125mm', '850W', 'Demarrage progressif', 'Poignee laterale'], stock: 20 },
  { id: '4', name: 'Multimetre digital professionnel', price: 59.99, category: 'Electricite', image: '📊', description: 'Multimetre digital multifonction. Mesure tension, courant, resistance et capacite.', features: ['Auto-range', 'Hold', 'Retro-eclairage', 'Test diode'], stock: 25 },
  { id: '5', name: 'Pinces isolees professionnelles', price: 45.99, category: 'Electricite', image: '🔌', description: 'Set de pinces isolees VDE. Securite maximisee pour travaux electriques.', features: ['VDE 1000V', '3 pinces', 'Etui rigide', 'Garantie a vie'], stock: 30 },
  { id: '6', name: 'Testeur de tension sans contact', price: 29.99, category: 'Electricite', image: '📡', description: 'Testeur de tension intelligent. Detection sans contact rapide et securisee.', features: ['LED indicator', 'Alarme sonore', 'Auto-off', 'Clip de poche'], stock: 50 },
  { id: '7', name: 'Kit cles mecaniciennes 50pcs', price: 79.99, category: 'Garage', image: '🔧', description: 'Kit complet de 50 pieces. Toutes les cles pour mecanique automobile.', features: ['Chrome vanadium', 'Etui roll', 'Toutes tailles', 'Garantie 5 ans'], stock: 12 },
  { id: '8', name: 'Cric hydraulique 3T', price: 149.99, category: 'Garage', image: '🚗', description: 'Cric hydraulique 3 tonnes. Capable de soulever les vehicules lourds.', features: ['3 tonnes', 'Hydraulique', 'Securite valve', 'Poignee pliante'], stock: 10 },
  { id: '9', name: 'Tronconneuse thermique 45cm', price: 299.99, category: 'Jardinage', image: '🪓', description: 'Tronconneuse thermique puissante 45cm. Idéale pour l abattage et elague.', features: ['45cm', '2 temps', 'Anti-vibration', 'Frein chaine'], stock: 5 },
  { id: '10', name: 'Tondeuse thermique autopropulsee', price: 449.99, category: 'Jardinage', image: '🌱', description: 'Tondeuse autopropulsee professionnelle. Coupe precise et uniforme.', features: ['52cm', 'Auto-projetee', 'Bac 60L', 'Reglage hauteur'], stock: 7 },
]

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const product = products.find(p => p.id === resolvedParams.id)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen bg-ingco-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Produit non trouve</h1>
          <Link href="/search" className="text-ingco-yellow hover:underline">
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

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
              <Link href="/categories" className="text-gray-300 hover:text-ingco-yellow transition-colors">Categories</Link>
              <Link href="/search" className="text-gray-300 hover:text-ingco-yellow transition-colors">Produits</Link>
              <Link href="/cart" className="text-gray-300 hover:text-ingco-yellow transition-colors">Panier</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-20 bg-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-ingco-yellow">Accueil</Link>
            <span className="text-gray-500">/</span>
            <Link href="/categories" className="text-gray-400 hover:text-ingco-yellow">{product.category}</Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-ingco-gray rounded-2xl p-12 flex items-center justify-center">
            <span className="text-9xl">{product.image}</span>
          </div>

          {/* Info */}
          <div>
            <span className="text-ingco-yellow text-sm font-semibold">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-ingco-yellow">{product.price}€</span>
              <span className="text-gray-500 ml-4">TTC</span>
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="text-red-500">Rupture de stock</span>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Quantite</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-ingco-gray rounded-lg text-white font-bold hover:bg-ingco-yellow hover:text-ingco-black"
                >
                  -
                </button>
                <span className="text-white text-xl w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 bg-ingco-gray rounded-lg text-white font-bold hover:bg-ingco-yellow hover:text-ingco-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-white transition-colors">
                Ajouter au panier
              </button>
              <button className="w-14 h-14 bg-ingco-gray rounded-xl flex items-center justify-center text-white hover:text-ingco-yellow hover:bg-ingco-gray/80">
                ❤️
              </button>
            </div>

            {/* Features */}
            <div className="bg-ingco-gray rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Caracteristiques</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-ingco-yellow">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-gray py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Outilles. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  )
}