'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icons'

// Reusable newsletter subscription form wired to /api/newsletter.
export default function NewsletterForm({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue')
        return
      }
      setStatus('ok')
      setMessage('Merci ! Votre inscription est confirmée.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Erreur de connexion au serveur')
    }
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email..."
        className="flex-1 bg-ingco-gray border border-ingco-dark rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-ingco-yellow focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-ingco-yellow text-ingco-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {status === 'loading' ? 'Envoi...' : "S'abonner"}
      </button>
      {message && (
        <p className={`sm:hidden text-sm ${status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
      )}
      {message && (
        <p className={`hidden sm:block sm:w-full text-sm ${status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
      )}
      {status === 'ok' && <Icon name="check" className="hidden" />}
    </form>
  )
}
