'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call - In production, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes, just show success
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-4">Email envoyé!</h1>
            <p className="text-gray-400 mb-6">
              Si un compte existe avec cet email, tu recevras un lien pour réinitialiser ton mot de passe.
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">Mot de passe oublié?</h1>
          <p className="text-gray-400 text-center mb-8">
            Entre ton email et nous t'enverrons un lien pour réinitialiser ton mot de passe.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                placeholder="ton@email.com"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? '⏳ Envoi en cours...' : '📧 Envoyer le lien'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Te souviens de ton mot de passe? </span>
            <Link href="/auth/login" className="text-ingco-yellow hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
