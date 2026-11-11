// Shared catalog metadata: category images (real SVG assets), sub-categories
// and icon images used across navigation and cards. Keeps the UI consistent
// and replaces emoji placeholders with real assets.

export interface CategoryMeta {
  slug: string
  name: string
  image: string
  color: string
  subcategories: string[]
}

// Category accents stay inside the brand's gold / bronze / steel family instead
// of an off-brand rainbow, so every card tint (rendered as `${color}22`) reads
// as E-Outilles. Values are shared with prisma/seed.ts (Category.color).
export const BRAND_ACCENTS = {
  gold: '#FFC400',
  goldLight: '#FFD54D',
  goldDeep: '#E6A200',
  amber: '#FFB300',
  bronze: '#CC9000',
  bronzeDeep: '#A67400',
  amberDark: '#D97706',
  amberDarker: '#B45309',
  olive: '#8A6700',
  steelLight: '#9CA3AF',
  steel: '#6E6E6E',
  steelDark: '#4B5563',
} as const

export const CATEGORY_META: CategoryMeta[] = [
  { slug: 'construction', name: 'Construction & BTP', image: '/products/marteau-perforateur.svg', color: BRAND_ACCENTS.goldDeep, subcategories: ['Marteaux perforateurs', 'Scies circulaires', 'Meuleuses', 'Escabeaux & échafaudages'] },
  { slug: 'electricite', name: 'Électricité', image: '/products/multimetre.svg', color: BRAND_ACCENTS.gold, subcategories: ['Multimètres', 'Pinces', 'Testeurs', 'Éclairage'] },
  { slug: 'garage', name: 'Garage Auto', image: '/products/kit-cles.svg', color: BRAND_ACCENTS.steelLight, subcategories: ['Crics & chandelles', 'Clés à chocs', 'Presses hydrauliques', 'Outillage moteur'] },
  { slug: 'jardinage', name: 'Jardinage', image: '/products/tondeuse.svg', color: BRAND_ACCENTS.olive, subcategories: ['Tondeuses', 'Tronçonneuses', 'Taille-haies', 'Souffleurs'] },
  { slug: 'power-tools', name: 'Outils Électriques', image: '/products/meuleuse-230.svg', color: BRAND_ACCENTS.amber, subcategories: ['Meuleuses', 'Scies électriques', 'Perceuses filaires', 'Ponceuses'] },
  { slug: 'cordless-tools', name: 'Outils Sans Fil', image: '/products/cordless-drill.svg', color: BRAND_ACCENTS.bronze, subcategories: ['Perceuses 20V', 'Visseuses', 'Clés à chocs', 'Batteries & chargeurs'] },
  { slug: 'hand-tools', name: 'Outils à Main', image: '/products/tournevis.svg', color: BRAND_ACCENTS.amberDarker, subcategories: ['Tournevis', 'Clés', 'Pinces', 'Marteaux'] },
  { slug: 'air-tools', name: 'Outils à Air', image: '/products/compressor.svg', color: BRAND_ACCENTS.steel, subcategories: ['Compresseurs', 'Clés à chocs pneumatiques', 'Pistolets', 'Accessoires air'] },
  { slug: 'measuring', name: 'Mesure & Niveau', image: '/products/niveau-laser.svg', color: BRAND_ACCENTS.goldLight, subcategories: ['Niveaux laser', 'Mètres', 'Pieds à coulisse', 'Détecteurs'] },
  { slug: 'garden', name: 'Jardin', image: '/products/tronconneuse.svg', color: BRAND_ACCENTS.olive, subcategories: ['Entretien pelouse', 'Élagage', 'Arrosage', 'Motoculteurs'] },
  { slug: 'automotive', name: 'Automobile', image: '/products/cric-rouleur.svg', color: BRAND_ACCENTS.amberDark, subcategories: ['Levage', 'Diagnostic', 'Outillage mécanicien', 'Entretien'] },
  { slug: 'drilling', name: 'Forage & Découpe', image: '/products/burins-sds.svg', color: BRAND_ACCENTS.steelDark, subcategories: ['Forets', 'Burins SDS', 'Disques diamant', 'Trépans'] },
  { slug: 'welding', name: 'Soudage', image: '/products/welder.svg', color: BRAND_ACCENTS.amberDark, subcategories: ['Postes à souder', 'Électrodes', 'Masques de soudage', 'Accessoires'] },
  { slug: 'generators', name: 'Générateurs', image: '/products/generator.svg', color: BRAND_ACCENTS.bronzeDeep, subcategories: ['Groupes électrogènes', 'Onduleurs', 'Groupes inverter', 'Accessoires'] },
  { slug: 'pumps', name: 'Pompes & Eau', image: '/products/pump.svg', color: BRAND_ACCENTS.steel, subcategories: ['Pompes immergées', 'Pompes de surface', 'Surpresseurs', 'Vidange'] },
  { slug: 'safety', name: 'Sécurité', image: '/products/casque.svg', color: BRAND_ACCENTS.gold, subcategories: ['Casques', 'Gants', 'Chaussures', 'Protection oculaire'] },
  { slug: 'storage', name: 'Rangement', image: '/products/coffret.svg', color: BRAND_ACCENTS.bronze, subcategories: ['Coffrets', 'Caisses à outils', 'Servantes', 'Valises'] },
  { slug: 'accessories', name: 'Accessoires', image: '/products/disque.svg', color: BRAND_ACCENTS.steelDark, subcategories: ['Disques', 'Forets', 'Consommables', 'Fixations'] },
]

const BY_SLUG: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORY_META.map((c) => [c.slug, c])
)

export function categoryImage(slug?: string | null): string {
  if (slug && BY_SLUG[slug]) return BY_SLUG[slug].image
  return '/products/coffret.svg'
}

export function categoryMeta(slug?: string | null): CategoryMeta | null {
  return slug ? BY_SLUG[slug] ?? null : null
}

export function subcategoriesFor(slug?: string | null): string[] {
  return slug ? BY_SLUG[slug]?.subcategories ?? [] : []
}

// Catalog slugs whose matching row in the database seed uses a different slug
// (e.g. the static catalog has both `garden` and `jardinage` for Jardinage).
export const DB_SLUG_ALIASES: Record<string, string> = {
  jardinage: 'garden',
}

export function dbSlugFor(slug?: string | null): string | null {
  if (!slug) return null
  return DB_SLUG_ALIASES[slug] ?? slug
}

// Blog category -> real image asset.
export const BLOG_CATEGORY_IMAGES: Record<string, string> = {
  Tous: '/blog/cordless-tools.svg',
  Construction: '/blog/marteau-perforateur.svg',
  'Électricité': '/blog/electricite.svg',
  Garage: '/blog/cles-garage.svg',
  Jardinage: '/blog/jardin-printemps.svg',
  Conseils: '/blog/consultation.svg',
  Services: '/blog/location-outils.svg',
  'Outils Sans Fil': '/blog/cordless-tools.svg',
  'Outils à Air': '/blog/compressor-guide.svg',
  Soudeuse: '/blog/welding-guide.svg',
  Générateurs: '/blog/generator-guide.svg',
  Automobile: '/blog/mecanicien.svg',
  Sécurité: '/blog/securite.svg',
  Accessoires: '/blog/accessories.svg',
}

export function blogCategoryImage(category?: string | null): string {
  if (category && BLOG_CATEGORY_IMAGES[category]) return BLOG_CATEGORY_IMAGES[category]
  return '/blog/cordless-tools.svg'
}
