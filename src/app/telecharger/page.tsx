'use client'

import { useEffect, useState } from 'react'
import { NavigationArrows, Icon } from '@/components/Icons'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function DownloadPage() {
  const [siteUrl, setSiteUrl] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setSiteUrl(window.location.origin)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice?.outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
  }

  const qrSrc = siteUrl ? `/api/qrcode?url=${encodeURIComponent(siteUrl)}` : ''

  return (
    <div className="min-h-screen bg-ingco-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Logo variant="horizontal" size={48} />
        </div>

        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Téléchargez l&apos;application E-Outilles
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Scannez le QR code ou installez l&apos;application directement sur votre téléphone.
            Accès rapide, fonctionnement hors-ligne et notifications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* QR code */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center animate-fade-in-up">
            <div className="bg-white rounded-2xl flex items-center justify-center min-h-[280px]">
              {qrSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrSrc} alt="QR code E-Outilles" className="w-full max-w-[280px]" />
              ) : (
                <div className="w-[280px] h-[280px] bg-gray-100 animate-pulse rounded-xl" />
              )}
            </div>
            <p className="text-ingco-black font-bold mt-4">Scannez pour ouvrir l&apos;application</p>
            <p className="text-gray-500 text-sm break-all">{siteUrl}</p>
            <a
              href={qrSrc}
              download="e-outilles-qr.png"
              className="inline-block mt-3 text-sm text-ingco-black underline"
            >
              Télécharger le QR code
            </a>
          </div>

          {/* Install instructions */}
          <div className="space-y-4">
            <button
              onClick={install}
              disabled={!deferredPrompt}
              className="w-full bg-ingco-yellow text-ingco-black py-4 rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all hover:scale-[1.02] disabled:opacity-60 animate-fade-in-up"
            >
              {installed ? 'Application installée' : 'Installer l\'application'}
            </button>

            <div className="bg-ingco-gray rounded-2xl p-6 animate-fade-in-up">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Icon name="download" className="w-5 h-5 text-ingco-yellow" /> Sur Android (Chrome)</h2>
              <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                <li>Ouvrez le site dans Chrome</li>
                <li>Menu ⋮ puis « Ajouter à l&apos;écran d&apos;accueil »</li>
                <li>Confirmez l&apos;installation</li>
              </ol>
            </div>

            <div className="bg-ingco-gray rounded-2xl p-6 animate-fade-in-up">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Icon name="download" className="w-5 h-5 text-ingco-yellow" /> Sur iPhone (Safari)</h2>
              <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                <li>Ouvrez le site dans Safari</li>
                <li>Bouton Partager</li>
                <li>« Sur l&apos;écran d&apos;accueil » puis « Ajouter »</li>
              </ol>
            </div>

            <div className="bg-ingco-gray rounded-2xl p-6 animate-fade-in-up">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Icon name="download" className="w-5 h-5 text-ingco-yellow" /> Sur ordinateur</h2>
              <p className="text-gray-300 text-sm">
                Cliquez sur l&apos;icône d&apos;installation dans la barre d&apos;adresse de votre navigateur.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-ingco-yellow hover:underline inline-flex items-center gap-1">
            <Icon name="arrow-left" className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <NavigationArrows current="/telecharger" />
      </div>
    </div>
  )
}
