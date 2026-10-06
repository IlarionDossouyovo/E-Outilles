'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setToken(params.get('token') || '')
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }
      setDone(true)
    } catch {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-4">Mot de passe modifié</h1>
            <p className="text-gray-400 mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <Link
              href="/auth/login"
              className="inline-block bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Se connecter
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
          <h1 className="text-3xl font-bold text-white text-center mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-400 text-center mb-8">Choisissez un nouveau mot de passe sécurisé.</p>

          {!token && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm">
              Lien invalide : aucun jeton fourni.
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? '⏳ Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-ingco-yellow hover:underline text-sm">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
