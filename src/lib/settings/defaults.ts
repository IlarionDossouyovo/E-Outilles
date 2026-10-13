// Client-safe settings shape and defaults (no Prisma import) so the admin
// Settings page can import them in the browser bundle.

export interface StoreSettings {
  shopName: string
  email: string
  phone: string
  address: string
  currency: string
  timezone: string
  shippingFree: number
  shippingCost: number
  taxRate: number
  codFee: number
  codEnabled: boolean
  momoEnabled: boolean
  cardEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  // Marketing: per-channel value (URL, handle or ID) keyed by channel id.
  // Also holds UTM defaults and the GA/Meta pixel ids.
  marketing: MarketingSettings
}

export interface MarketingSettings {
  channels: Record<string, string>
  defaultUtmSource: string
  defaultUtmMedium: string
  gaMeasurementId: string
  metaPixelId: string
  tiktokPixelId: string
  whatsappOrderNumber: string
}

export const DEFAULT_MARKETING: MarketingSettings = {
  channels: {},
  defaultUtmSource: '',
  defaultUtmMedium: 'social',
  gaMeasurementId: '',
  metaPixelId: '',
  tiktokPixelId: '',
  whatsappOrderNumber: '',
}

export const DEFAULT_SETTINGS: StoreSettings = {
  shopName: 'E-Outilles',
  email: 'contact@eoutilles.com',
  phone: '+229 01 977 003 47',
  address: 'Cotonou, Bénin',
  currency: 'EUR',
  timezone: 'Africa/Porto-Novo',
  shippingFree: 50,
  shippingCost: 5,
  taxRate: 18,
  codFee: 0,
  codEnabled: true,
  momoEnabled: true,
  cardEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  marketing: { ...DEFAULT_MARKETING },
}
