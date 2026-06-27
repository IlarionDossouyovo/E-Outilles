'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { loginAction } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setRedirecting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setRedirecting(false)
    } else if (result?.success) {
      // Store session and redirect
      localStorage.setItem('eoutilles_session', JSON.stringify(result.user))
      router.push('/profile')
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Connexion</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}

          {redirecting && (
            <div className="bg-ingco-yellow/20 text-ingco-yellow px-4 py-2 rounded-xl mb-4">
              Redirection...
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Mot de passe</label>
              <input
                type="password"
                name="password"
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

            <button 
              type="submit" 
              disabled={redirecting}
              className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {redirecting ? '⏳ Connexion...' : '🔐 Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Pas de compte? </span>
            <Link href="/auth/register" className="text-ingco-yellow hover:underline">
              S'inscrire
            </Link>
          </div>

          <div className="mt-8 border-t border-ingco-dark pt-6">
            <p className="text-gray-500 text-sm text-center mb-4">Compte demo</p>
            <div className="bg-ingco-dark rounded-xl p-3 text-center">
              <p className="text-gray-400 text-sm">Email: <span className="text-white">demo@e-outilles.com</span></p>
              <p className="text-gray-400 text-sm">Mot de passe: <span className="text-white">demo123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}