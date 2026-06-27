'use client'

import { useState } from 'react'
import Link from 'next/link'

const products = [
  { id: '1', name: 'Perceuse visseuse INGCO 20V', price: 89.99, category: 'Construction', image: '🔩', description: 'Perceuse visseuse puissante 20V avec batterie longue duree.', features: ['20V lithium', '2 batteries', 'Chargeur rapide'], stock: 15 },
  { id: '2', name: 'Marteau perforateur SDS Max 1500W', price: 249.99, category: 'Construction', image: '⚒️', description: 'Marteau perforateur professionnel.', features: ['1500W', 'SDS Max'], stock: 8 },
  { id: '3', name: 'Meuleuse angulaire 125mm', price: 79.99, category: 'Construction', image: '⚙️', description: 'Meuleuse compacte.', features: ['125mm', '850W'], stock: 20 },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id)
  const [quantity, setQuantity] = useState(1)

  if (!product) return <div className="min-h-screen bg-ingco-black flex items-center justify-center"><h1 className="text-4xl font-bold text-white">Produit non trouve</h1></div>

  return (
    <div className="min-h-screen bg-ingco-black">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray p-4">
        <Link href="/" className="text-ingco-yellow font-bold text-xl">← E-Outilles</Link>
      </nav>
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <div className="text-9xl text-center mb-8">{product.image}</div>
        <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
        <p className="text-gray-400 text-lg mb-6">{product.description}</p>
        <div className="text-4xl font-bold text-ingco-yellow mb-6">{product.price}€</div>
        <button className="bg-ingco-yellow text-ingco-black px-8 py-4 rounded-xl font-bold">Ajouter au panier</button>
      </div>
    </div>
  )
}
