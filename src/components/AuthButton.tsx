'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSessionAction, logoutAction } from '@/app/actions'
import type { SessionUser } from '@/lib/security/session'
import { isFounderEmail } from '@/lib/security/founder'

export default function AuthButton() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessionAction()
      .then(result => setUser(result.user))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <Link 
        href="/auth/login" 
        className="px-4 py-2 text-sm hover:text-ingco-yellow transition-colors"
      >
        Connexion
      </Link>
    )
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="text-sm font-semibold text-ingco-yellow hover:text-yellow-400 transition-colors"
          >
            Administration
          </Link>
        )}
        {isFounderEmail(user.email) && (
          <Link
            href="/agent"
            className="text-sm font-semibold text-ingco-yellow hover:text-yellow-400 transition-colors"
          >
            Agents IA
          </Link>
        )}
        <Link href="/profile" className="text-sm hover:text-ingco-yellow transition-colors">
          Mon compte
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-400 transition-colors"
        >
          Deconnexion
        </button>
      </div>
    )
  }

  return (
    <Link 
      href="/auth/login" 
      className="px-4 py-2 bg-ingco-yellow text-ingco-black rounded-xl font-medium hover:bg-yellow-400 transition-colors"
    >
      Connexion
    </Link>
  )
}