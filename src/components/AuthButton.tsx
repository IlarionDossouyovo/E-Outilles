'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSessionAction, logoutAction } from '@/app/actions'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check session
    const stored = localStorage.getItem('eoutilles_session')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
    getSessionAction().then(result => {
      if (result.user) setUser(result.user)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('eoutilles_session')
    await logoutAction()
    window.location.href = '/auth/login'
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
      <div className="flex items-center gap-4">
        <Link href="/profile" className="text-sm hover:text-ingco-yellow transition-colors">
          {user.name || user.email}
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