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
}
