'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'
import { Icon } from '@/components/Icons'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
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
      setError(t('reset.tooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('reset.mismatch'))
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
        setError(data.error || t('err.generic'))
        return
      }
      setDone(true)
    } catch {
      setError(t('err.server'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-ingco-black pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-ingco-gray rounded-2xl p-8 text-center">
            <Icon name="check" className="w-14 h-14 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">{t('reset.done')}</h1>
            <p className="text-gray-400 mb-6">{t('reset.doneText')}</p>
            <Link
              href="/auth/login"
              className="inline-block bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              {t('auth.signIn')}
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
          <h1 className="text-3xl font-bold text-white text-center mb-2">{t('reset.title')}</h1>
          <p className="text-gray-400 text-center mb-8">{t('reset.subtitle')}</p>

          {!token && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm">
              {t('reset.noToken')}
            </div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <PasswordInput
              label={t('reset.new')}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <PasswordInput
              label={t('reset.confirm')}
              value={confirm}
              onChange={setConfirm}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? t('reset.submitting') : t('reset.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-ingco-yellow hover:underline text-sm">
              {t('forgot.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
