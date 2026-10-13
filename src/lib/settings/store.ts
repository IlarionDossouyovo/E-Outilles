// Persisted store settings, stored as a single JSON row in the Setting table.
// The admin Settings page reads/writes through here so the values survive
// reloads instead of being hardcoded in the component.

import { prisma } from '@/lib/db/prisma'
import { DEFAULT_SETTINGS, type StoreSettings } from '@/lib/settings/defaults'

export { DEFAULT_SETTINGS }
export type { StoreSettings }

const SETTINGS_KEY = 'store'

// Coerce an untrusted payload to a valid partial StoreSettings, dropping
// unknown keys so a bad request can never inject arbitrary rows.
export function sanitizeSettings(input: unknown): Partial<StoreSettings> {
  if (!input || typeof input !== 'object') return {}
  const src = input as Record<string, unknown>
  const out: Partial<StoreSettings> = {}
  const strings: (keyof StoreSettings)[] = ['shopName', 'email', 'phone', 'address', 'currency', 'timezone']
  const numbers: (keyof StoreSettings)[] = ['shippingFree', 'shippingCost', 'taxRate', 'codFee']
  const booleans: (keyof StoreSettings)[] = [
    'codEnabled', 'momoEnabled', 'cardEnabled', 'emailNotifications', 'smsNotifications',
  ]

  for (const k of strings) {
    if (typeof src[k] === 'string') (out[k] as unknown) = String(src[k]).slice(0, 200)
  }
  for (const k of numbers) {
    const n = Number(src[k])
    if (Number.isFinite(n) && n >= 0) (out[k] as unknown) = n
  }
  for (const k of booleans) {
    if (typeof src[k] === 'boolean') (out[k] as unknown) = src[k]
  }
  return out
}

export async function getSettings(): Promise<StoreSettings> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } })
    if (!row) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(row.value) as Partial<StoreSettings>
    return { ...DEFAULT_SETTINGS, ...sanitizeSettings(parsed) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function saveSettings(patch: unknown): Promise<StoreSettings> {
  const current = await getSettings()
  const next = { ...current, ...sanitizeSettings(patch) }
  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: JSON.stringify(next) },
    create: { key: SETTINGS_KEY, value: JSON.stringify(next) },
  })
  return next
}
