'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  isLocale,
  localeForLanguageTag,
  localeMeta,
  type Locale,
} from './config'
import { translate } from './dictionaries'

// Automatic page translation driven by the visitor's country.
//
// Resolution order (first match wins):
//   1. ?lang=xx query parameter (explicit, shareable link)
//   2. explicit choice saved in localStorage
//   3. country reported by GET /api/geo (edge/CDN header)
//   4. browser language
//   5. DEFAULT_LOCALE
//
// The chosen locale is mirrored to <html lang> and to localStorage so a reload
// keeps the visitor's language.

const STORAGE_KEY = 'eoutilles.locale'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  htmlLang: string
  ready: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(stored) ? stored : null
  } catch {
    return null
  }
}

function readQueryLocale(): Locale | null {
  try {
    const value = new URLSearchParams(window.location.search).get('lang')
    return isLocale(value) ? value : null
  } catch {
    return null
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [ready, setReady] = useState(false)

  const applyLocale = useCallback((next: Locale, persist: boolean) => {
    setLocaleState(next)
    try {
      if (persist) window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable (private mode): keep the in-memory value only
    }
    document.documentElement.lang = localeMeta(next).htmlLang
  }, [])

  useEffect(() => {
    const fromQuery = readQueryLocale()
    if (fromQuery) {
      applyLocale(fromQuery, true)
      setReady(true)
      return
    }

    const stored = readStoredLocale()
    if (stored) {
      applyLocale(stored, false)
      setReady(true)
      return
    }

    let cancelled = false
    fetch('/api/geo')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return
        if (data?.detected && isLocale(data.locale)) {
          applyLocale(data.locale, false)
        } else {
          const fromBrowser = localeForLanguageTag(navigator.language)
          applyLocale(fromBrowser || DEFAULT_LOCALE, false)
        }
      })
      .catch(() => {
        if (cancelled) return
        const fromBrowser = localeForLanguageTag(navigator.language)
        applyLocale(fromBrowser || DEFAULT_LOCALE, false)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [applyLocale])

  const setLocale = useCallback(
    (next: Locale) => applyLocale(next, true),
    [applyLocale]
  )

  const t = useCallback((key: string) => translate(locale, key), [locale])

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t, htmlLang: localeMeta(locale).htmlLang, ready }),
    [locale, setLocale, t, ready]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

// Convenience hook for components that only need the translator.
export function useTranslation() {
  const { t, locale, setLocale } = useLanguage()
  return { t, locale, setLocale }
}
