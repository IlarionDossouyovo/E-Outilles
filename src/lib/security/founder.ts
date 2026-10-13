// Founder-only guard. Edge-safe (no Prisma, no Node APIs) so the middleware
// can use it. The founder is identified by email: FOUNDER_EMAIL when set,
// otherwise the canonical founder address. The canonical address always works
// too, so a wrong FOUNDER_EMAIL value can never lock the real founder out.

import { FOUNDER } from '@/lib/founder'

const CANONICAL_FOUNDER_EMAIL = FOUNDER.email.toLowerCase()
const CONFIGURED_FOUNDER_EMAIL = (process.env.FOUNDER_EMAIL || '').trim().toLowerCase()

export const FOUNDER_EMAIL = CONFIGURED_FOUNDER_EMAIL || CANONICAL_FOUNDER_EMAIL

const FOUNDER_EMAILS = new Set(
  [CONFIGURED_FOUNDER_EMAIL, CANONICAL_FOUNDER_EMAIL].filter(Boolean)
)

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return FOUNDER_EMAILS.has(email.trim().toLowerCase())
}
