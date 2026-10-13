// Product images are stored as a JSON array string (e.g. '["/products/x.svg"]').
// These helpers normalize that value into a usable path.

export function parseImages(images: string | null | undefined): string[] {
  if (!images) return []
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    // Not JSON: treat a plain string as a single path.
    return images.trim() ? [images] : []
  }
}

export function firstImage(images: string | null | undefined): string {
  return parseImages(images)[0] || '/logo/e-outilles-favicon.svg'
}
