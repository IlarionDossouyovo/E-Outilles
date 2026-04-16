'use client'

import { useState, useEffect } from 'react'
import { COOKIE_CONSENT_KEY, defaultConsent, UserConsent } from '@/lib/security/gdpr'

interface CookieConsentProps {
  onConsent?: (consent: UserConsent) => void
}

export default function CookieConsent({ onConsent }: CookieConsentProps) {
  const [show, setShow] = useState(false)
  const [consent, setConsent] = useState<UserConsent>(defaultConsent)

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!savedConsent) {
      setShow(true)
    } else {
      try {
        const parsed = JSON.parse(savedConsent)
        setConsent(parsed)
        onConsent?.(parsed)
      } catch {
        setShow(true)
      }
    }
  }, [onConsent])

  const handleAccept = (type: 'all' | 'necessary') => {
    const newConsent: UserConsent = type === 'all' 
      ? { analytics: true, marketing: true, cookies: true, timestamp: new Date().toISOString() }
      : { ...defaultConsent, timestamp: new Date().toISOString() }
    
    setConsent(newConsent)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent))
    setShow(false)
    onConsent?.(newConsent)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-ingco-gray rounded-2xl p-6 shadow-2xl border border-ingco-dark">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              🍪 Respect de votre vie privée
            </h3>
            <p className="text-gray-400 text-sm">
              Nous utilisons des cookies pour améliorer votre expérience. 
              Vous pouvez choisir d&apos;accepter tous les cookies ou uniquement les essentiels.
            </p>
            <div className="mt-3 flex gap-4 text-xs text-gray-500">
              <a href="/privacy" className="hover:text-ingco-yellow underline">Politique de confidentialité</a>
              <a href="/terms" className="hover:text-ingco-yellow underline">Conditions d'utilisation</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAccept('all')}
              className="bg-ingco-yellow text-ingco-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Accepter tout
            </button>
            <button
              onClick={() => handleAccept('necessary')}
              className="border border-ingco-gray text-gray-400 px-6 py-3 rounded-xl font-medium hover:border-gray-500 hover:text-white transition-colors"
            >
              Essentiels uniquement
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
