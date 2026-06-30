import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Categories data
const categories = [
  {
    id: 'construction',
    name: 'Construction & BTP',
    slug: 'construction',
    description: 'Outils pour le bâtiment et les travaux publics',
    icon: '🏗️',
    color: '#FF6B35'
  },
  {
    id: 'electricite',
    name: 'Électricité',
    slug: 'electricite',
    description: 'Outils et équipements électriques',
    icon: '⚡',
    color: '#FFD700'
  },
  {
    id: 'garage',
    name: 'Garage Auto',
    slug: 'garage',
    description: 'Outils pour garage et automobile',
    icon: '🚗',
    color: '#4ECDC4'
  },
  {
    id: 'jardinage',
    name: 'Jardinage',
    slug: 'jardinage',
    description: 'Outils pour le jardin',
    icon: '🌿',
    color: '#95D5B2'
  }
]

// Products data
const products = [
  // Construction
  {
    name: 'Marteau perforateur SDS Max 18V',
    slug: 'marteau-perforateur-sds-max',
    description: 'Marteau perforateur professionnel brushless 18V avec burins. Puissance de perforation élevée pour le béton et la pierre. Mandrin SDS-Max.',
    price: 289.99,
    comparePrice: 349.99,
    sku: 'HIK-001',
    stock: 45,
    images: '["/products/hik-001.jpg"]',
    features: '["18V Brushless","SDS-Max","3 modes","Frein électronique"]',
    categoryId: 'construction'
  },
  {
    name: 'Perceuse visseuse à percussion 20V',
    slug: 'perceuse-visseuse-20v',
    description: 'Perceuse visseuse à percussion professionnelle 20V avec moteur brushless. Couple élevé de 85Nm. Fonction percussion pour béton.',
    price: 159.99,
    comparePrice: 199.99,
    sku: 'DEW-001',
    stock: 120,
    images: '["/products/dew-001.jpg"]',
    features: '["20V Li-Ion","85Nm","Brushless","2 vitesses"]',
    categoryId: 'construction'
  },
  {
    name: 'Niveau laser automatique',
    slug: 'niveau-laser-auto',
    description: 'Niveau laser automatique avec tripod. Précision ±0.3mm/m. Portée 50m. Ligne horizontale et verticale.',
    price: 89.99,
    comparePrice: 119.99,
    sku: 'BOS-001',
    stock: 67,
    images: '["/products/bos-001.jpg"]',
    features: '["±0.3mm/m","50m portée","Auto-nivellant","Vert"]',
    categoryId: 'construction'
  },
  // Electricité
  {
    name: 'Multimètre professionnel True-RMS',
    slug: 'multimetre-rms',
    description: 'Multimètre numérique professionnel avec détection sans contact NCV. Mesure tension, courant, résistance, capacité, température.',
    price: 79.99,
    comparePrice: 99.99,
    sku: 'FLU-001',
    stock: 200,
    images: '["/products/flu-001.jpg"]',
    features: '["True-RMS","NCV","6000 counts","Température"]',
    categoryId: 'electricite'
  },
  {
    name: 'Pince dénudeuse automatique',
    slug: 'pince-denudeuse',
    description: 'Pince dénudeuse automatique professionnelle pour câbles 0.2-6mm². Réglage précis de la profondeur de dénudage.',
    price: 34.99,
    comparePrice: 44.99,
    sku: 'KN-001',
    stock: 150,
    images: '["/products/kn-001.jpg"]',
    features: '["0.2-6mm²","Automatique","Réglage précision"]',
    categoryId: 'electricite'
  },
  {
    name: 'Tournevis isolé 1000V',
    slug: 'tournevis-isole',
    description: 'Set de tournevis isolés 1000V认证. 6 pièces: fentes et Phillips. Norme IEC 60900.',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'WERA-001',
    stock: 300,
    images: '["/products/wera-001.jpg"]',
    features: '["1000V","6 pièces","IEC 60900","Garantie à vie"]',
    categoryId: 'electricite'
  },
  // Garage
  {
    name: 'Clé à chocs pneumatics 1/2"',
    slug: 'cle-chocs-12',
    description: 'Clé à chocs pneumatique professionnelle 1/2". Couple max 1500Nm. Carter aluminium. Livrée avec douilles.',
    price: 189.99,
    comparePrice: 249.99,
    sku: 'ING-001',
    stock: 80,
    images: '["/products/ing-001.jpg"]',
    features: '["1/2\"","1500Nm","6 positions","Carross aluminium"]',
    categoryId: 'garage'
  },
  {
    name: 'Cric rouleur 3T',
    slug: 'cric-rouleur-3t',
    description: 'Cric rouleur hydraulique 3 tonnes. Hauteur min 75mm, max 510mm. Roulette nylon.',
    price: 119.99,
    comparePrice: 159.99,
    sku: 'RAV-001',
    stock: 60,
    images: '["/products/rav-001.jpg"]',
    features: '["3 Tonnes","75-510mm","Hydraulique","Roulettes nylon"]',
    categoryId: 'garage'
  },
  {
    name: 'Kit clés mixtes 40 pièces',
    slug: 'kit-cles-40',
    description: 'Kit de clés mixtes ouvertes/douilles 40 pièces. Acier chrome vanadium. Métriques et pouces.',
    price: 59.99,
    comparePrice: 79.99,
    sku: 'STA-001',
    stock: 180,
    images: '["/products/sta-001.jpg"]',
    features: '["40 pièces","CrV","Métriques","Pouces"]',
    categoryId: 'garage'
  },
  // Jardinage
  {
    name: 'Tondeuse thermique 45cm',
    slug: 'tondeuse-thermique-45',
    description: 'Tondeuse thermique autopropulsée 45cm. Moteur 165cc. Bac 60L. Hauteur de coupe 25-75mm.',
    price: 349.99,
    comparePrice: 429.99,
    sku: 'HUS-001',
    stock: 35,
    images: '["/products/hus-001.jpg"]',
    features: '["165cc","45cm","60L bac","Autopropulsée"]',
    categoryId: 'jardinage'
  },
  {
    name: 'Taille-haie électrique 60cm',
    slug: 'taille-haie-60',
    description: 'Taille-haie électrique 60cm. Lames laser. Double action. Protection des mains. Câble 30m.',
    price: 89.99,
    comparePrice: 119.99,
    sku: 'STIH-001',
    stock: 70,
    images: '["/products/stih-001.jpg"]',
    features: '["60cm","450W","Lames laser","Double action"]',
    categoryId: 'jardinage'
  },
  {
    name: 'Scie de précision GT Max 52V',
    slug: 'scie-garden-52v',
    description: 'Scie de précision sur batterie 52V. Guide 75cm. Coupe horizontale/verticale. Sans fil.',
    price: 599.99,
    comparePrice: 749.99,
    sku: 'ECHO-001',
    stock: 25,
    images: '["/products/echo-001.jpg"]',
    features: '["52V","75cm guide","Sans fil","Coupe multi-angle"]',
    categoryId: 'jardinage'
  }
]

// Blog posts data
const blogPosts = [
  // Construction
  {
    title: 'Comment choisir son marteau perforateur?',
    slug: 'choisir-marteau-perforateur',
    content: `Choisir un marteau perforateur adapté à vos besoins est essentiel pour la réussite de vos projets.

## Les critères essentiels:

### 1. Type de mandrin
- **SDS-Plus**: Pour usage domestique à professionnel léger
- **SDS-Max**: Pour usage professionnel intensif

### 2. Tension de la batterie
- **18V**: Bon compromis puissance/poids
- **36V**: Pour les travaux les plus exigeants

### 3. Moteur brushless
Les moteurs brushless offrent:
- Plus longue durée de vie
- Plus de puissance
- Meilleure efficacité énergétique

## Notre recommandation:

Pour la plupart des professionnels, le **marteau perforateur SDS-Max 18V** est le choix idéal. Il offre suffisamment de puissance pour le béton tout en restant maniable.

Chez E-Outille, nous proposons les meilleures marques: Makita, DeWalt, Bosch Professional, et Hilti.`,
    excerpt: 'Guide complet pour choisir le bon marteau perforateur pour vos travaux.',
    image: '/blog/marteau-perforateur.jpg',
    author: 'Équipe E-Outille',
    category: 'Construction',
    published: true,
    featured: true,
    categoryId: 'construction'
  },
  // Electricité
  {
    title: 'Sécurité électrique: Les essentiels',
    slug: 'securite-electrique',
    content: `Travailler avec l'électricité nécessite des précautions strictes. Voici les équipements essentiels.

## Équipements de protection

### 1. Gants isolants
- **Classe 00**: 500V
- **Classe 0**: 1000V
- Norme IEC 60900

### 2. Tournevis isolés
- Vérifier l'état régulièrement
- Utiliser des tournevis certifiés 1000V

### 3. Multimètre
- Choisir un modèle True-RMS
- Vérifier les fonctions NCV (détection sans contact)

## Les 5 règles d'or

1. **Couper le courant** avant toute intervention
2. **Vérifier l'absence de tension** avec le multimètre
3. **Mettre en œuvre** les dispositifs de verrouillage
4. **Protéger** les éléments sous tension
5. **Signaler** l'intervention

## Notre sélection:

Nous recommandons les tournevis isolés WERA et les multimètres Fluke pour leur fiabilité professionnelle.`,
    excerpt: 'Les équipements et règles de sécurité pour travailler en électricité.',
    image: '/blog/electricite.jpg',
    author: 'Équipe E-Outille',
    category: 'Électricité',
    published: true,
    featured: true,
    categoryId: 'electricite'
  },
  // Garage
  {
    title: 'Kit de clés: Tout savoir',
    slug: 'kit-cles-outils',
    content: `Un bon kit de clés est la base de l'équipement de tout mécanicien.

## Types de clés

### Clés mixtes
- Une extrémité ouverte
- Une extrémité fermée (douille)
- Idéales pour les espaces confinés

### Clés à douilles
- Plus de couple
- Système à clicks
- Embouts interchangeables

### Clés Torx
- Forme en étoile
- Plus de contact
- Idéales pour l'automobile

## Notre sélection

Pour un garage professionnel, nous recommandons un kit de 40 à 100 pièces minimum incluant:
- Métriques (mm)
- Pouces
- Clés Torx
- Clés mâles (imbus)

Les marques références: Stanley, Snap-on, Facom.`,
    excerpt: 'Guide pour choisir le bon kit de clés pour votre garage.',
    image: '/blog/cles-garage.jpg',
    author: 'Équipe E-Outille',
    category: 'Garage',
    published: true,
    featured: true,
    categoryId: 'garage'
  },
  // Jardinage
  {
    title: 'Entretien du jardin au printemps',
    slug: 'entretien-jardin-printemps',
    content: `Le printemps est la saison idéale pour préparer votre jardin. Voici les tâches essentielles.

## Tontes
- Première tonte: quand l'herbe atteint 10cm
- Hauteur de coupe: 5-7cm
- Fréquence: 1x par semaine

## Taille
- Taille-haie: fin du printemps
- Arbustes à fleurs: après la floraison
- Haies formales: 2x par an

## Entretien des outils
1. **Nettoyer** les lames
2. **Affûter** les couteaux
3. **Vérifier** les batteries
4. **Graisser** les pièces mobiles

## Notre sélection d'outils

Pour un jardin impeccable:
- **Tondeuse**: Thermique pour grand jardin, électrique pour petit
- **Taille-haie**: Électrique ou sur batterie
- **Scie**: Pour les branches épaisses

Les marques recommandées: Husqvarna, Stihl, Echo.`,
    excerpt: 'Guide d\'entretien du jardin au printemps.',
    image: '/blog/jardin-printemps.jpg',
    author: 'Équipe E-Outille',
    category: 'Jardinage',
    published: true,
    featured: true,
    categoryId: 'jardinage'
  }
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    })
    console.log(`✓ Created category: ${cat.name}`)
  }

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    })
    console.log(`✓ Created product: ${product.name}`)
  }

  // Create blog posts
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    })
    console.log(`✓ Created blog post: ${post.title}`)
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })