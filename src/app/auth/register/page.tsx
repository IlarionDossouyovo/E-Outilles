'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock register - in production call API
    localStorage.setItem('eoutilles_user', JSON.stringify({ email, name, country }))
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Creer un compte</h1>
          <p className="text-gray-400 text-center mb-8">Rejoignez E-Outilles</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Pays</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
              >
                <option value="">Selectionner...</option>
                <option value="SN">Senegal</option>
                <option value="CI">Cote d'Ivoire</option>
                <option value="CM">Cameroun</option>
                <option value="BE">Benin</option>
                <option value="FR">France</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <label className="flex items-start gap-2 mt-4">
              <input type="checkbox" className="bg-ingco-dark border-ingco-gray rounded mt-1" required />
              <span className="text-gray-400 text-sm">
                J&apos;accepte les <Link href="/cgu" className="text-ingco-yellow hover:underline">CGV</Link> et la <Link href="/rgpd" className="text-ingco-yellow hover:underline">politique de confidentialite</Link>
              </span>
            </label>

            <button type="submit" className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Creer mon compte
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Deja un compte? </span>
            <Link href="/auth/login" className="text-ingco-yellow hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
