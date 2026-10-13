// Founder-only guard. Edge-safe (no Prisma, no Node APIs) so the middleware
// can use it. The founder is identified by email: FOUNDER_EMAIL when set,
// otherwise the canonical founder address.

import { FOUNDER } from '@/lib/founder'

export const FOUNDER_EMAIL = (process.env.FOUNDER_EMAIL || FOUNDER.email).toLowerCase()

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.toLowerCase() === FOUNDER_EMAIL
}
