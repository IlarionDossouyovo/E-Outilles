// Only allow same-site absolute paths as post-login redirect targets.
// Prevents open redirects via ?redirect=//evil.com or ?redirect=https://evil.com.
export function safeRedirect(value: string | null | undefined, fallback = ''): string {
  if (!value) return fallback
  let path = value.trim()
  try {
    path = decodeURIComponent(path)
  } catch {
    // keep the raw value if it is not valid percent-encoding
  }
  // Must start with a single "/" and not "//" or "/\".
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return fallback
  }
  return path
}
