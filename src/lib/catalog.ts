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

export const CATEGORY_META: CategoryMeta[] = [
  { slug: 'construction', name: 'Construction & BTP', image: '/products/marteau-perforateur.svg', color: '#D97706', subcategories: ['Marteaux perforateurs', 'Scies circulaires', 'Meuleuses', 'Escabeaux & échafaudages'] },
  { slug: 'electricite', name: 'Électricité', image: '/products/multimetre.svg', color: '#FFD700', subcategories: ['Multimètres', 'Pinces', 'Testeurs', 'Éclairage'] },
  { slug: 'garage', name: 'Garage Auto', image: '/products/kit-cles.svg', color: '#4ECDC4', subcategories: ['Crics & chandelles', 'Clés à chocs', 'Presses hydrauliques', 'Outillage moteur'] },
  { slug: 'jardinage', name: 'Jardinage', image: '/products/tondeuse.svg', color: '#95D5B2', subcategories: ['Tondeuses', 'Tronçonneuses', 'Taille-haies', 'Souffleurs'] },
  { slug: 'power-tools', name: 'Outils Électriques', image: '/products/meuleuse-230.svg', color: '#EF4444', subcategories: ['Meuleuses', 'Scies électriques', 'Perceuses filaires', 'Ponceuses'] },
  { slug: 'cordless-tools', name: 'Outils Sans Fil', image: '/products/cordless-drill.svg', color: '#2563EB', subcategories: ['Perceuses 20V', 'Visseuses', 'Clés à chocs', 'Batteries & chargeurs'] },
  { slug: 'hand-tools', name: 'Outils à Main', image: '/products/tournevis.svg', color: '#3B82F6', subcategories: ['Tournevis', 'Clés', 'Pinces', 'Marteaux'] },
  { slug: 'air-tools', name: 'Outils à Air', image: '/products/compressor.svg', color: '#0EA5E9', subcategories: ['Compresseurs', 'Clés à chocs pneumatiques', 'Pistolets', 'Accessoires air'] },
  { slug: 'measuring', name: 'Mesure & Niveau', image: '/products/niveau-laser.svg', color: '#8B5CF6', subcategories: ['Niveaux laser', 'Mètres', 'Pieds à coulisse', 'Détecteurs'] },
  { slug: 'garden', name: 'Jardin', image: '/products/tronconneuse.svg', color: '#22C55E', subcategories: ['Entretien pelouse', 'Élagage', 'Arrosage', 'Motoculteurs'] },
  { slug: 'automotive', name: 'Automobile', image: '/products/cric-rouleur.svg', color: '#F97316', subcategories: ['Levage', 'Diagnostic', 'Outillage mécanicien', 'Entretien'] },
  { slug: 'drilling', name: 'Forage & Découpe', image: '/products/burins-sds.svg', color: '#6B7280', subcategories: ['Forets', 'Burins SDS', 'Disques diamant', 'Trépans'] },
  { slug: 'welding', name: 'Soudage', image: '/products/welder.svg', color: '#DC2626', subcategories: ['Postes à souder', 'Électrodes', 'Masques de soudage', 'Accessoires'] },
  { slug: 'generators', name: 'Générateurs', image: '/products/generator.svg', color: '#CA8A04', subcategories: ['Groupes électrogènes', 'Onduleurs', 'Groupes inverter', 'Accessoires'] },
  { slug: 'pumps', name: 'Pompes & Eau', image: '/products/pump.svg', color: '#06B6D4', subcategories: ['Pompes immergées', 'Pompes de surface', 'Surpresseurs', 'Vidange'] },
  { slug: 'safety', name: 'Sécurité', image: '/products/casque.svg', color: '#EAB308', subcategories: ['Casques', 'Gants', 'Chaussures', 'Protection oculaire'] },
  { slug: 'storage', name: 'Rangement', image: '/products/coffret.svg', color: '#14B8A6', subcategories: ['Coffrets', 'Caisses à outils', 'Servantes', 'Valises'] },
  { slug: 'accessories', name: 'Accessoires', image: '/products/disque.svg', color: '#4F46E5', subcategories: ['Disques', 'Forets', 'Consommables', 'Fixations'] },
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
