'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - in production call API
    localStorage.setItem('eoutilles_user', JSON.stringify({ email, name: 'User' }))
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Connexion</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="text-gray-400 text-sm mb-2 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="bg-ingco-dark border-ingco-gray rounded" />
                <span className="text-gray-400 text-sm">Se souvenir</span>
              </label>
              <Link href="/auth/forgot-password" className="text-ingco-yellow text-sm hover:underline">
                Mot de passe oublie?
              </Link>
            </div>

            <button type="submit" className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Pas de compte? </span>
            <Link href="/auth/register" className="text-ingco-yellow hover:underline">
              S'inscrire
            </Link>
          </div>

          <div className="mt-8 border-t border-ingco-dark pt-6">
            <p className="text-gray-500 text-sm text-center mb-4">Ou se connecter avec</p>
            <div className="flex gap-4">
              <button className="flex-1 bg-ingco-dark py-2 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors">
                Google
              </button>
              <button className="flex-1 bg-ingco-dark py-2 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
