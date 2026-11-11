'use client'

import { useState } from 'react'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'
import { safeRedirect } from '@/lib/security/redirect'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création du compte')
        setLoading(false)
        return
      }

      const target =
        safeRedirect(new URLSearchParams(window.location.search).get('redirect')) || '/profile'
      window.location.assign(target)
    } catch {
      setError(t('auth.serverError'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">{t('auth.register')}</h1>
          <p className="text-gray-400 text-center mb-8">{t('auth.join')}</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('auth.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('auth.country')}</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
              >
                <option value="">{t('auth.select')}</option>
                <option value="SN">Senegal</option>
                <option value="CI">Cote d'Ivoire</option>
                <option value="CM">Cameroun</option>
                <option value="BE">Benin</option>
                <option value="FR">France</option>
                <option value="OTHER">{t('auth.other')}</option>
              </select>
            </div>
            
            <PasswordInput
              label={t('auth.password')}
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
            />

            <label className="flex items-start gap-2 mt-4">
              <input type="checkbox" className="bg-ingco-dark border-ingco-gray rounded mt-1" required />
              <span className="text-gray-400 text-sm">
                {t('auth.terms')} <Link href="/cgu" className="text-ingco-yellow hover:underline">{t('auth.termsLink')}</Link> {t('auth.termsAnd')} <Link href="/rgpd" className="text-ingco-yellow hover:underline">{t('auth.privacyLink')}</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? t('auth.creating') : t('auth.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">{t('auth.haveAccount')} </span>
            <Link href="/auth/login" className="text-ingco-yellow hover:underline">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
