// Signed session tokens (HMAC-SHA256) — edge-compatible (Web Crypto)

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const DEFAULT_SECRET = 'e-outilles-dev-secret-change-me'
const SECRET = process.env.SESSION_SECRET || DEFAULT_SECRET

// Warn loudly when production runs with the insecure fallback secret.
// (We do not throw, so a missing SESSION_SECRET never takes the site down;
// scripts/update.ps1 generates one automatically on first run.)
if (process.env.NODE_ENV === 'production' && SECRET === DEFAULT_SECRET) {
  console.warn(
    '[security] SESSION_SECRET is not set - using the insecure development default. ' +
      'Define SESSION_SECRET in .env (48+ random characters) before going live.'
  )
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: string
  country?: string | null
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function strToB64url(str: string): string {
  return bytesToB64url(new TextEncoder().encode(str))
}

function b64urlToStr(value: string): string {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : ''
  const bin = atob(b64 + pad)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return bytesToB64url(new Uint8Array(sig))
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload = strToB64url(JSON.stringify({ user, exp: Date.now() + SESSION_MAX_AGE * 1000 }))
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null

  const expected = await hmac(payload)
  if (!safeEqual(sig, expected)) return null

  try {
    const data = JSON.parse(b64urlToStr(payload)) as { user: SessionUser; exp: number }
    if (!data.exp || Date.now() > data.exp) return null
    return data.user
  } catch {
    return null
  }
}
