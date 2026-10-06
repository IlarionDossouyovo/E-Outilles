'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icons'
import Logo from '@/components/Logo'

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSessionId(params.get('session_id') || '')
  }, [])

  return (
    <div className="min-h-screen bg-ingco-black flex items-center justify-center p-4">
      <div className="bg-ingco-gray rounded-3xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="check" className="w-10 h-10 text-green-400" />
        </div>
        <Logo variant="horizontal" size={40} />
        <h1 className="text-2xl font-bold text-white mt-4 mb-4">Paiement confirmé</h1>
        <p className="text-gray-400 mb-6">
          Merci ! Votre paiement a bien été reçu et votre commande est en cours de traitement.
        </p>
        {sessionId && (
          <div className="bg-ingco-dark rounded-xl p-3 mb-6">
            <p className="text-gray-500 text-xs">Référence de paiement</p>
            <p className="text-ingco-yellow font-mono text-xs break-all">{sessionId}</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/profile" className="bg-ingco-yellow text-ingco-black py-3 rounded-xl font-bold hover:bg-yellow-400">
            Voir mes commandes
          </Link>
          <Link href="/" className="border border-ingco-gray text-white py-3 rounded-xl font-bold hover:border-white">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
