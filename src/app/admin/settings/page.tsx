'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: 'E-Outilles',
    email: 'contact@eoutilles.com',
    phone: '+229 01 977 003 47',
    address: 'Cotonou, Bénin',
    currency: 'EUR',
    timezone: 'Africa/Porto-Novo',
    shippingFree: '50',
    shippingCost: '5',
    taxRate: '18',
    codFee: '0',
    stripeEnabled: false,
    momoEnabled: true,
    emailNotifications: true,
    smsNotifications: false
  })

  const handleSave = () => {
    alert('Paramètres enregistrés!')
  }

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
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-ingco-yellow text-sm hover:underline">← Dashboard</Link>
          <h1 className="text-3xl font-bold text-white mt-2">Paramètres</h1>
          <p className="text-gray-400">Configurez votre boutique</p>
        </div>

        <div className="space-y-6">
          {/* Informations boutique */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🏪 Informations boutique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Nom de la boutique</label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Téléphone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Adresse</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🌍 Localisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Devise</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                >
                  <option value="EUR">EUR (Euro)</option>
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Fuseau horaire</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                >
                  <option value="Africa/Porto-Novo">Bénin (WAT)</option>
                  <option value="Africa/Dakar">Sénégal (GMT)</option>
                  <option value="Africa/Abidjan">Côte d'Ivoire (GMT)</option>
                  <option value="Europe/Paris">France (CET)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🚚 Livraison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Livraison gratuite (€)</label>
                <input
                  type="number"
                  value={settings.shippingFree}
                  onChange={(e) => setSettings({...settings, shippingFree: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Frais de livraison (€)</label>
                <input
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => setSettings({...settings, shippingCost: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">TVA (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                  className="w-full bg-ingco-black border border-ingco-dark rounded-xl px-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Paiements */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">💳 Moyens de paiement</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Paiement à la livraison (COD)</div>
                  <div className="text-gray-500 text-sm">Frais: {settings.codFee}€</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Mobile Money</div>
                  <div className="text-gray-500 text-sm">MTN, Moov, Orange</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Stripe (Carte)</div>
                  <div className="text-gray-500 text-sm">Bientôt disponible</div>
                </div>
                <input type="checkbox" disabled className="w-5 h-5 accent-gray-500" />
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-ingco-gray rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔔 Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Notifications email</div>
                  <div className="text-gray-500 text-sm">Nouvelle commande, contact...</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-ingco-yellow" />
              </label>
              <label className="flex items-center justify-between p-4 bg-ingco-dark rounded-xl">
                <div>
                  <div className="text-white font-medium">Notifications SMS</div>
                  <div className="text-gray-500 text-sm">Alertes importantes</div>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-ingco-yellow" />
              </label>
            </div>
          </div>

          {/* Enregistrer */}
          <button
            onClick={handleSave}
            className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
          >
            💾 Enregistrer les paramètres
          </button>
        </div>
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