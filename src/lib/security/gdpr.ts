// GDPR Compliance Utilities

export interface UserConsent {
  analytics: boolean
  marketing: boolean
  cookies: boolean
  timestamp: string
}

export interface UserData {
  email?: string
  name?: string
  phone?: string
  country?: string
  orders?: string[]
  marketingConsent: UserConsent
}

// Cookie consent configuration
export const COOKIE_CONSENT_KEY = 'eoutilles_consent'
export const COOKIE_EXPIRY_DAYS = 365

// Default consent (denied by default per GDPR)
export const defaultConsent: UserConsent = {
  analytics: false,
  marketing: false,
  cookies: false,
  timestamp: new Date().toISOString(),
}

// Privacy policy URL
export const privacyPolicyUrl = '/privacy'
export const termsUrl = '/terms'

// Data retention periods (in days)
export const retentionPeriods = {
  orders: 2555, // 7 years for tax purposes
  analytics: 730, // 2 years
  marketing: 730, // 2 years
  session: 1, // 1 day
}

// Export user data (GDPR Article 15)
export function exportUserData(userData: UserData): string {
  return JSON.stringify(userData, null, 2)
}

// Delete user data (GDPR Article 17)
export function sanitizeUserData(userData: UserData): Partial<UserData> {
  return {
    marketingConsent: userData.marketingConsent,
    country: userData.country, // Keep country for analytics (anonymized)
  }
}

// Check if consent is valid
export function isConsentValid(consent: UserConsent): boolean {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  return new Date(consent.timestamp) > sixMonthsAgo
}