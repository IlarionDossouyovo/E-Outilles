'use client'

import { useEffect, useRef, useState } from 'react'
import { LOCALES } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/LanguageProvider'

// Compact language picker. Shows the active locale flag and lets the visitor
// override the country-based automatic choice. The selection is persisted by
// the LanguageProvider.
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = LOCALES.find((l) => l.code === locale) || LOCALES[0]

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Changer de langue"
        className="flex items-center gap-1.5 p-2 rounded-lg text-gray-300 hover:text-ingco-yellow hover:bg-ingco-gray/60 transition-colors"
      >
        <span aria-hidden className="text-base leading-none">{active.flag}</span>
        <span className="hidden xl:inline text-xs font-semibold uppercase">{active.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 py-1 rounded-xl bg-ingco-dark border border-ingco-gray shadow-xl z-50 animate-pop-in"
        >
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === locale}
                onClick={() => {
                  setLocale(l.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                  l.code === locale
                    ? 'text-ingco-yellow bg-ingco-yellow/10'
                    : 'text-gray-300 hover:bg-ingco-gray/60 hover:text-ingco-yellow'
                }`}
              >
                <span aria-hidden>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
