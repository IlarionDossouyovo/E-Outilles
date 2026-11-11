'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@/components/Icons'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || t('err.generic'))
        return
      }
      setSubmitted(true)
    } catch {
      setError(t('err.server'))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <Icon name="check" className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">{t('forgot.sent')}</h1>
            <p className="text-gray-400 mb-6">
              {t('forgot.sentText')}
            </p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              {t('forgot.backToLogin')}
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
          <h1 className="text-3xl font-bold text-white text-center mb-2">{t('forgot.title')}</h1>
          <p className="text-gray-400 text-center mb-8">
            {t('forgot.subtitle')}
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('auth.email')}</label>
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
              {loading ? t('forgot.sending') : t('forgot.send')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">{t('forgot.remember')} </span>
            <Link href="/auth/login" className="text-ingco-yellow hover:underline">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
