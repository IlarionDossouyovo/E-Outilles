// Verifies that every French catalogue string exposed to the UI has a
// translation in src/lib/i18n/content.ts. Run with `npm run check:i18n`.
// It parses the translation table with a regex (no TS build step) and compares
// it against the live product and category rows in the database.

import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const source = readFileSync(new URL('../src/lib/i18n/content.ts', import.meta.url), 'utf8')
const keys = new Set(
  [...source.matchAll(/^\s*'((?:[^'\\]|\\.)*)':\s*\[/gm)].map((m) => m[1].replace(/\\'/g, "'"))
)

const prisma = new PrismaClient()

const missing = []
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
} finally {
  await prisma.$disconnect()
}

if (missing.length === 0) {
  console.log(`i18n coverage OK — ${keys.size} strings translated, no gaps.`)
  process.exit(0)
}

console.error(`Missing ${missing.length} translation(s):`)
for (const item of missing) console.error(`  - ${item}`)
process.exit(1)
