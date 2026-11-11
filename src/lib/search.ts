// Product search helpers.
//
// Postgres `contains` is case-sensitive (unlike SQLite, which the project used
// before moving to Neon), so every text filter must pass `mode: 'insensitive'`.
// Accents are not folded by the database either, so "beton" would never match
// "Béton". We expand each query word into a small set of accent variants that
// covers the realistic French/Spanish/Portuguese cases (a single accented
// letter per word, the overwhelmingly common situation) without a full
// combinatorial explosion.

const ACCENT_MAP: Record<string, string[]> = {
  a: ['a', 'à', 'â', 'ä'],
  e: ['e', 'é', 'è', 'ê', 'ë'],
  i: ['i', 'î', 'ï'],
  o: ['o', 'ô', 'ö'],
  u: ['u', 'ù', 'û', 'ü'],
  c: ['c', 'ç'],
  n: ['n', 'ñ'],
}

const MAX_VARIANTS_PER_WORD = 12

export function foldAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Every accented spelling of a single word: the original plus one variant per
// accentable letter (only that letter accented). "beton" -> beton, béton, bèton,
// bêton, betôn, betòn... Capped so a pathological word can't blow up the query.
export function accentVariants(word: string): string[] {
  const variants = new Set<string>([word])
  const lower = word.toLowerCase()
  for (let i = 0; i < lower.length; i += 1) {
    const options = ACCENT_MAP[lower[i]]
    if (!options) continue
    for (const option of options) {
      if (option === lower[i]) continue
      variants.add(word.slice(0, i) + option + word.slice(i + 1))
      if (variants.size >= MAX_VARIANTS_PER_WORD) return Array.from(variants)
    }
  }
  return Array.from(variants)
}

export interface SearchTerm {
  contains: string
  mode: 'insensitive'
}

// Flatten a free-text query into `contains` filters usable inside a Prisma `OR`.
export function searchTerms(query: string, maxWords = 5): SearchTerm[] {
  return foldAccents(query)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, maxWords)
    .flatMap((word) => accentVariants(word).map((v) => ({ contains: v, mode: 'insensitive' as const })))
}
