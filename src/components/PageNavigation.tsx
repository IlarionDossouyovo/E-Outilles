'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/LanguageProvider'

interface PageNavigationProps {
  showHome?: boolean
  showBack?: boolean
  backLabel?: string
}

export default function PageNavigation({ showHome = true, showBack = true, backLabel }: PageNavigationProps) {
  const { t } = useTranslation()
  const label = backLabel ?? t('common.back')
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">{label}</span>
          </button>
        )}
      </div>
      
      {showHome && (
        <Link 
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-ingco-yellow transition-colors"
        >
          <span className="font-medium">{t('common.home')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}
