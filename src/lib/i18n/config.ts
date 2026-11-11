// Localisation: supported locales and the country -> locale mapping used to
// auto-select a language for a visitor (see LanguageProvider).

export type Locale = 'fr' | 'en' | 'es' | 'pt'

export interface LocaleMeta {
  code: Locale
  label: string
  flag: string
  htmlLang: string
}

export const LOCALES: LocaleMeta[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', htmlLang: 'fr-FR' },
  { code: 'en', label: 'English', flag: '🇬🇧', htmlLang: 'en-US' },
  { code: 'es', label: 'Español', flag: '🇪🇸', htmlLang: 'es-ES' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', htmlLang: 'pt-PT' },
]

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_CODES = LOCALES.map((l) => l.code)

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALE_CODES as string[]).includes(value)
}

// Countries where French is the working language (West/Central Africa + France
// + Belgium + Switzerland + Canada). The shop's primary market is West Africa.
const FR_COUNTRIES = [
  'FR', 'BE', 'CH', 'CA', 'BJ', 'TG', 'CI', 'SN', 'ML', 'BF', 'NE', 'GN',
  'CM', 'GA', 'CG', 'CD', 'TD', 'CF', 'MG', 'LU', 'MC', 'HT',
]
const ES_COUNTRIES = ['ES', 'MX', 'AR', 'CO', 'PE', 'CL', 'VE', 'EC', 'GT', 'CU', 'DO', 'BO', 'PY', 'UY', 'CR', 'PA', 'HN', 'NI', 'SV']
const PT_COUNTRIES = ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL']

// Resolves a locale from an ISO-3166 alpha-2 country code.
export function localeForCountry(country?: string | null): Locale | null {
  if (!country) return null
  const cc = country.toUpperCase()
  if (FR_COUNTRIES.includes(cc)) return 'fr'
  if (ES_COUNTRIES.includes(cc)) return 'es'
  if (PT_COUNTRIES.includes(cc)) return 'pt'
  return 'en'
}

// Resolves a locale from a BCP-47 language tag (e.g. "en-GB", "pt-BR").
export function localeForLanguageTag(tag?: string | null): Locale | null {
  if (!tag) return null
  const base = tag.toLowerCase().split('-')[0]
  return isLocale(base) ? base : null
}

export function localeMeta(code: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === code) || LOCALES[0]
}
