// Payment providers configuration
// Use environment variables for sensitive keys

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  countries: string[]
  currency: string
  enabled: boolean
}

export const paymentMethods: PaymentMethod[] = [
  // International
  {
    id: 'visa',
    name: 'Visa',
    icon: '💳',
    countries: ['WW'],
    currency: 'EUR',
    enabled: true
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    icon: '💳',
    countries: ['WW'],
    currency: 'EUR',
    enabled: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    countries: ['WW'],
    currency: 'EUR',
    enabled: true
  },
  // Africa - West Africa
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    icon: '🌍',
    countries: ['NG', 'GH', 'KE', 'ZA', 'TZ', 'UG'],
    currency: 'XOF',
    enabled: true
  },
  {
    id: 'paystack',
    name: 'Paystack',
    icon: '💰',
    countries: ['NG', 'GH'],
    currency: 'XOF',
    enabled: true
  },
  // Mobile Money - Africa
  {
    id: 'mtn-momo',
    name: 'MTN Mobile Money',
    icon: '📱',
    countries: ['CI', 'GH', 'NG', 'CM', 'RW', 'UG'],
    currency: 'XOF',
    enabled: true
  },
  {
    id: 'orange-money',
    name: 'Orange Money',
    icon: '🍊',
    countries: ['CI', 'SN', 'ML', 'BF', 'NE'],
    currency: 'XOF',
    enabled: true
  },
  {
    id: 'moov-money',
    name: 'Moov Money',
    icon: '🔵',
    countries: ['BJ', 'TG', 'NE', 'ML', 'BF'],
    currency: 'XOF',
    enabled: true
  },
  // Crypto (optional)
  {
    id: 'crypto',
    name: 'Crypto (USDT)',
    icon: '₿',
    countries: ['WW'],
    currency: 'USD',
    enabled: false
  }
]

// Get payment methods by country
export function getPaymentMethodsByCountry(countryCode: string): PaymentMethod[] {
  return paymentMethods.filter(
    pm => pm.enabled && (pm.countries.includes('WW') || pm.countries.includes(countryCode))
  )
}

// Get currency by country
export function getCurrencyByCountry(countryCode: string): string {
  const westAfrica = ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'CM', 'NG', 'GH']
  const cfaCountries = ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG']
  
  if (cfaCountries.includes(countryCode)) return 'XOF'
  if (westAfrica.includes(countryCode)) return 'XOF'
  return 'EUR'
}