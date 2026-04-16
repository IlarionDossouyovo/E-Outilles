'use client'

import { useState, useEffect } from 'react'
import { getPaymentMethodsByCountry, getCurrencyByCountry, PaymentMethod } from '@/lib/payments/providers'

interface CountryDetectorProps {
  onCountryDetected?: (country: string) => void
  children: (methods: PaymentMethod[], currency: string, country: string) => React.ReactNode
}

export default function CountryDetector({ onCountryDetected, children }: CountryDetectorProps) {
  const [country, setCountry] = useState<string>('WW') // WW = Worldwide default
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Detect country from browser locale or IP
    const detectCountry = async () => {
      try {
        // Try to get from localStorage first
        const savedCountry = localStorage.getItem('eoutilles_country')
        if (savedCountry) {
          setCountry(savedCountry)
          onCountryDetected?.(savedCountry)
          setLoading(false)
          return
        }

        // Use browser language as fallback
        const browserLang = navigator.language.split('-')[1]?.toUpperCase() || 'WW'
        const countryMap: Record<string, string> = {
          'CI': 'CI', // Ivory Coast
          'SN': 'SN', // Senegal
          'GH': 'GH', // Ghana
          'NG': 'NG', // Nigeria
          'KE': 'KE', // Kenya
          'FR': 'FR', // France
          'BE': 'BE', // Belgium
          'CM': 'CM', // Cameroon
        }
        
        const detectedCountry = countryMap[browserLang] || 'WW'
        setCountry(detectedCountry)
        localStorage.setItem('eoutilles_country', detectedCountry)
        onCountryDetected?.(detectedCountry)
      } catch {
        setCountry('WW')
      } finally {
        setLoading(false)
      }
    }

    detectCountry()
  }, [onCountryDetected])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-ingco-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const methods = getPaymentMethodsByCountry(country)
  const currency = getCurrencyByCountry(country)

  return <>{children(methods, currency, country)}</>
}