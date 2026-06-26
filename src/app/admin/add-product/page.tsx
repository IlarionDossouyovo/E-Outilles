'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const categories = ['Construction', 'Électricité', 'Garage', 'Jardinage']

export default function AddProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Construction',
    description: '',
    stock: '',
    sku: ''
  })
  const [image, setImage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Produit "${form.name}" ajouté avec succès!`)
    router.push('/admin')
  }

  const icons = ['🔩', '⚒️', '⚙️', '📊', '🔌', '📡', '🔧', '🚗', '💨', '🌿', '🪚', '💧']

  return (
    <div className="min-h-screen bg-ingco-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ingco-black/95 backdrop-blur-md border-b border-ingco-gray">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-ingco-yellow rounded-lg flex items-center justify-center">
              <span className="text-ingco-black font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-xl">E-<span className="text-ingco-yellow">Outilles</span></span>
            <span className="bg-ingco-yellow text-ingco-black text-xs px-2 py-1 rounded ml-2">Admin</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-ingco-yellow">Accueil</Link>
            <Link href="/admin" className="text-gray-300 hover:text-ingco-yellow">Dashboard</Link>
            <Link href="/search" className="text-gray-300 hover:text-ingco-yellow">Produits</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline">← Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">Ajouter un produit</h1>
          <p className="text-gray-400">Ajoutez un nouveau produit à votre catalogue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ingco-gray rounded-2xl p-6 space-y-6">
          {/* Nom du produit */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Nom du produit *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="Ex: Perceuse visseuse INGCO 20V"
              className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
            />
          </div>

          {/* Prix et Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
                placeholder="89.99"
                className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({...form, stock: e.target.value})}
                placeholder="100"
                className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          {/* Catégorie et SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Catégorie *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">SKU</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({...form, sku: e.target.value})}
                placeholder="ING-001"
                className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          {/* Icône */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Icône</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setImage(icon)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition-all ${
                    image === icon 
                      ? 'border-ingco-yellow bg-ingco-yellow/20' 
                      : 'border-ingco-dark hover:border-gray-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            {image && <p className="text-gray-400 text-sm mt-2">Sélectionné: {image}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Description du produit..."
              rows={4}
              className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              ➕ Ajouter le produit
            </button>
            <Link 
              href="/admin"
              className="px-6 py-4 rounded-xl border border-ingco-gray text-white hover:border-white transition-colors flex items-center justify-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-ingco-dark border-t border-ingco-gray py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 E-Outilles Admin.</p>
        </div>
      </footer>
    </div>
  )
}