'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { loginAction } from '@/app/actions'
import PasswordInput from '@/components/PasswordInput'
import { safeRedirect } from '@/lib/security/redirect'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

export default function LoginPage() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  const [redirectTo, setRedirectTo] = useState('')

  useEffect(() => {
    setRedirectTo(safeRedirect(new URLSearchParams(window.location.search).get('redirect')))
  }, [])

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
      const target = safeRedirect(new URLSearchParams(window.location.search).get('redirect')) || '/profile'
      // Full navigation: a client-side router.push can race the Server Action
      // cookie commit, so middleware would still see an unauthenticated request
      // and bounce back to /auth/login.
      window.location.assign(target)
    }
  }

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-ingco-gray rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">{t('auth.login')}</h1>

          {redirectTo.startsWith('/admin') && (
            <div className="bg-ingco-yellow/15 border border-ingco-yellow/40 text-ingco-yellow px-4 py-3 rounded-xl mb-4 text-sm">
              {t('auth.adminNotice')}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-xl mb-4">
              {error}
            </div>
          )}

          {redirecting && (
            <div className="bg-ingco-yellow/20 text-ingco-yellow px-4 py-2 rounded-xl mb-4">
              {t('auth.redirecting')}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                className="w-full bg-ingco-dark border border-ingco-dark rounded-xl px-4 py-3 text-white focus:border-ingco-yellow focus:outline-none"
                required
              />
            </div>

            <PasswordInput label={t('auth.password')} name="password" autoComplete="current-password" required />

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="bg-ingco-dark border-ingco-gray rounded" />
                <span className="text-gray-400 text-sm">{t('auth.remember')}</span>
              </label>
              <Link href="/auth/forgot-password" className="text-ingco-yellow text-sm hover:underline">
                {t('auth.forgot')}
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={redirecting}
              className="w-full bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {redirecting ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">{t('auth.noAccount')} </span>
            <Link href="/auth/register" className="text-ingco-yellow hover:underline">
              {t('auth.signUp')}
            </Link>
          </div>

          <div className="mt-8 border-t border-ingco-dark pt-6">
            <p className="text-gray-500 text-sm text-center mb-4">{t('auth.demo')}</p>
            <div className="bg-ingco-dark rounded-xl p-3 text-center">
              <p className="text-gray-400 text-sm">{t('auth.email')}: <span className="text-white">demo@e-outilles.com</span></p>
              <p className="text-gray-400 text-sm">{t('auth.password')}: <span className="text-white">demo123</span></p>
            </div>

            <div className="mt-4 bg-ingco-yellow/10 border border-ingco-yellow/30 rounded-xl p-3 text-center">
              <p className="text-ingco-yellow text-sm font-semibold mb-1">{t('auth.adminAccess')}</p>
              <p className="text-gray-400 text-sm">{t('auth.email')}: <span className="text-white">admin@e-outilles.com</span></p>
              <p className="text-gray-400 text-sm">{t('auth.password')}: <span className="text-white">admin123</span></p>
              <Link href="/admin" className="text-ingco-yellow text-sm hover:underline mt-2 inline-block">
                {t('auth.adminDashboard')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}