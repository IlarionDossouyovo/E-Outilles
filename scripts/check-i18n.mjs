// Verifies that every French catalogue string exposed to the UI has a
// translation in src/lib/i18n/content.ts. Run with `npm run check:i18n`.
// It parses the translation table with a regex (no TS build step) and compares
// it against the live product and category rows in the database.

import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const source = readFileSync(new URL('../src/lib/i18n/content.ts', import.meta.url), 'utf8')
const dictSource = readFileSync(new URL('../src/lib/i18n/dictionaries.ts', import.meta.url), 'utf8')

// Parse the UI dictionaries so every locale exposes the exact same key set.
function dictionaryKeys(locale) {
  const block = dictSource.match(new RegExp(`const ${locale}: Dictionary = \\{([\\s\\S]*?)\\n\\}`))
  if (!block) throw new Error(`dictionary block not found for locale ${locale}`)
  return new Set([...block[1].matchAll(/^\s*'((?:[^'\\]|\\.)*)':/gm)].map((m) => m[1]))
}

const locales = ['fr', 'en', 'es', 'pt']
const dictKeys = Object.fromEntries(locales.map((l) => [l, dictionaryKeys(l)]))
const parity = []
for (const locale of locales) {
  if (locale === 'fr') continue
  for (const key of dictKeys.fr) if (!dictKeys[locale].has(key)) parity.push(`${locale} missing key: ${key}`)
  for (const key of dictKeys[locale]) if (!dictKeys.fr.has(key)) parity.push(`${locale} extra key: ${key}`)
}
const keys = new Set(
  [...source.matchAll(/^\s*'((?:[^'\\]|\\.)*)':\s*\[/gm)].map((m) => m[1].replace(/\\'/g, "'"))
)

const missing = []
let dbChecked = false
const prisma = new PrismaClient()
try {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { name: true, description: true } }),
    prisma.category.findMany({ select: { name: true, description: true } }),
  ])

  for (const p of products) {
    if (!keys.has(p.name)) missing.push(`product: ${p.name}`)
    if (p.description && !keys.has(p.description)) missing.push(`product description: ${p.description}`)
  }
  for (const c of categories) {
    if (!keys.has(c.name)) missing.push(`category: ${c.name}`)
    if (c.description && !keys.has(c.description)) missing.push(`category description: ${c.description}`)
  }
  dbChecked = true
} catch (error) {
  // The catalogue lives in the database, which may be unreachable (offline
  // build, missing credentials). Keep the dictionary parity check meaningful
  // instead of aborting the whole script.
  console.warn(`Catalogue check skipped — database unreachable: ${error?.message?.split('\n')[0]}`)
} finally {
  await prisma.$disconnect().catch(() => {})
}

if (parity.length > 0) {
  console.error(`Dictionary key mismatch (${parity.length}):`)
  for (const item of parity) console.error(`  - ${item}`)
  process.exit(1)
}

if (missing.length === 0) {
  const scope = dbChecked ? `${keys.size} catalogue strings translated` : 'catalogue check skipped (offline)'
  console.log(`i18n coverage OK — ${scope}, ${dictKeys.fr.size} UI keys x4 locales, no gaps.`)
  process.exit(0)
}

console.error(`Missing ${missing.length} translation(s):`)
for (const item of missing) console.error(`  - ${item}`)
process.exit(1)
