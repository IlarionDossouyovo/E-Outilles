// Regression check for the accent-insensitive product search.
//
// The site runs on Postgres (Neon) where `contains` is case-sensitive and does
// not fold accents, so the search helper is the single place that guarantees a
// query like "perceuse" or "beton" matches "Perceuse"/"Béton". Run with:
//   npm run check:search
import { accentVariants, foldAccents, searchTerms } from '../src/lib/search'

let failures = 0
function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ok   ${label}`)
  } else {
    failures += 1
    console.error(`  FAIL ${label}`)
  }
}

console.log('search helper')

check('foldAccents removes accents', foldAccents('Béton Tronçonneuse') === 'Beton Tronconneuse')

const variants = accentVariants('beton')
check('accentVariants includes the accented spelling', variants.includes('béton'))
check('accentVariants includes the plain spelling', variants.includes('beton'))

const terms = searchTerms('Perceuse à percussion béton')
check('searchTerms lowercases every term', terms.every((t) => t.contains === t.contains.toLowerCase()))
check('searchTerms keeps the plain spelling', terms.some((t) => t.contains === 'beton'))
check('searchTerms also emits the accented spelling', terms.some((t) => t.contains === 'béton'))
check('searchTerms uses insensitive matching', terms.every((t) => t.mode === 'insensitive'))
check('searchTerms drops one-letter noise words', !terms.some((t) => t.contains.length < 2))

const needle = (q: string) => searchTerms(q).map((t) => t.contains)
const matches = (haystack: string, q: string) => {
  const folded = foldAccents(haystack.toLowerCase())
  return needle(q).some((n) => folded.includes(n))
}
check('"perceuse" matches "Perceuse visseuse sans fil 20V"', matches('Perceuse visseuse sans fil 20V', 'perceuse'))
check('"beton" matches "Vibreur à béton électrique"', matches('Vibreur à béton électrique', 'beton'))
check('"tronconneuse" matches "Tronçonneuse thermique 50cm"', matches('Tronçonneuse thermique 50cm', 'tronconneuse'))

if (failures > 0) {
  console.error(`\nsearch check failed: ${failures} assertion(s)`)
  process.exit(1)
}
console.log('\nsearch check OK')
