'use client'

import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { localizeText, localizeList } from '@/lib/i18n/content'

// Translates catalogue/database strings inside server-rendered pages without
// forcing them to render dynamically. The text is the canonical French value;
// it is swapped for the active locale once the client provider is ready.
export function LocalizedText({ text }: { text?: string | null }) {
  const { locale } = useLanguage()
  return <>{localizeText(text, locale)}</>
}

export function LocalizedList({ items }: { items: readonly string[] }) {
  const { locale } = useLanguage()
  return <>{localizeList(items, locale).join(', ')}</>
}
