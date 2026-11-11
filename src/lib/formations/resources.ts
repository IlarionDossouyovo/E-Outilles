// Downloadable training resources shown on /formations. Single source of truth
// shared by the page (titles/type) and the PDF route
// (GET /api/formations/[slug]), so a resource can never render a dead button.

export interface ResourceSection {
  heading: string
  paragraphs: string[]
}

export interface TrainingResource {
  slug: string
  title: string
  category: string
  type: string
  summary: string
  sections: ResourceSection[]
}

export const TRAINING_RESOURCES: TrainingResource[] = [
  {
    slug: 'guide-outils-electriques',
    title: 'Guide complet: Choisir son outil électrique',
    category: 'Outils Électriques',
    type: 'Guide PDF',
    summary:
      "Méthode pas à pas pour choisir une perceuse, une meuleuse ou un marteau perforateur adapté à votre usage, avec les critères de puissance et de sécurité.",
    sections: [
      {
        heading: '1. Définir le besoin avant le produit',
        paragraphs: [
          "Un outil électrique se choisit d'abord par l'usage, pas par la marque. Listez le matériau (bois, métal, béton), la fréquence d'utilisation (occasionnelle, quotidienne, intensive) et l'accès au chantier (étroit, en hauteur, extérieur).",
          "Un usage occasionnel en atelier ne demande pas le même couple qu'un chantier de gros œuvre. Surdimensionner fait grimper le prix et le poids ; sous-dimensionner use l'outil prématurément.",
        ],
      },
      {
        heading: '2. Lire les caractéristiques techniques',
        paragraphs: [
          "La puissance (W) donne une idée du couple disponible mais ne suffit pas : regardez aussi la vitesse de rotation (tr/min) et le diamètre maximal recommandé.",
          "Pour une perceuse à percussion, le nombre de frappes par minute détermine l'efficacité dans le béton. Pour une meuleuse, le diamètre de disque fixe la profondeur de coupe utile.",
        ],
      },
      {
        heading: '3. Sécurité et accessoires',
        paragraphs: [
          "Vérifiez systématiquement la classe d'isolation et la présence d'un carter de protection conforme. Le port d'EPI (lunettes, gants, protection auditive) est obligatoire pour tout travail à percussion ou en découpe.",
          "Prévoyez les consommables dès l'achat : forets adaptés au support, disques au bon diamètre, batteries de rechange pour les modèles sans fil.",
        ],
      },
      {
        heading: '4. Entretien pour durer',
        paragraphs: [
          "Soufflez les aérations après chaque usage intensif, contrôlez l'usure des charbons sur les outils filaires et stockez les batteries entre 30 et 60 % de charge dans un endroit sec.",
        ],
      },
    ],
  },
  {
    slug: 'catalogue-ingco-2026',
    title: 'Catalogue technique INGCO 2026',
    category: 'Tous produits',
    type: 'Catalogue',
    summary:
      "Panorama des 15 familles de produits INGCO distribuées par E-Outilles, avec les références clés et les usages recommandés pour chaque gamme.",
    sections: [
      {
        heading: 'Gamme Outils Électriques',
        paragraphs: [
          "Perceuses à percussion, meuleuses angulaires, marteaux perforateurs SDS-Plus et SDS-Max, scies circulaires et sauteuses. Les modèles filaires conviennent aux postes fixes, les modèles sans fil aux interventions mobiles.",
        ],
      },
      {
        heading: 'Gamme Sans Fil 20V',
        paragraphs: [
          "Une plateforme de batteries 20V commune permet d'utiliser la même énergie sur perceuse, visseuse, meuleuse, scie et éclairage. Un seul chargeur, plusieurs outils : idéal pour les équipes qui se déplacent.",
        ],
      },
      {
        heading: 'Outillage à Main et Mesure',
        paragraphs: [
          "Clés, douilles, tournevis, pinces, mètres, niveaux laser et détecteurs. Les outils à main INGCO sont forgés en acier au chrome-vanadium pour résister au couple élevé.",
        ],
      },
      {
        heading: 'Jardinage, Automobile et Énergie',
        paragraphs: [
          "Tronçonneuses, débroussailleuses, tondeuses, compresseurs, groupes électrogènes et pompes. Chaque référence est sélectionnée pour la disponibilité des pièces et des consommables en Afrique de l'Ouest.",
        ],
      },
    ],
  },
  {
    slug: 'maintenance-preventive',
    title: 'Maintenance préventive des outils',
    category: 'Technique',
    type: 'Guide',
    summary:
      "Un plan d'entretien simple pour doubler la durée de vie de vos outils électroportatifs et éviter les pannes coûteuses en pleine activité.",
    sections: [
      {
        heading: 'Après chaque utilisation',
        paragraphs: [
          "Nettoyez les copeaux et la poussière, vérifiez l'état du câble ou de la batterie, resserrez les vis de carter et rangez l'outil dans sa housse.",
        ],
      },
      {
        heading: 'Chaque mois',
        paragraphs: [
          "Contrôlez l'usure des balais sur les outils filaires, graissez les engrenages accessibles et testez le bon fonctionnement des interrupteurs et du variateur.",
        ],
      },
      {
        heading: 'Batteries lithium-ion',
        paragraphs: [
          "Ne descendez jamais sous 20 % de charge avant recharge prolongée, évitez la chaleur et rechargez à température ambiante. Une batterie stockée à plat perd sa capacité définitivement.",
        ],
      },
      {
        heading: 'Quand remplacer plutôt que réparer',
        paragraphs: [
          "Si le coût des pièces dépasse la moitié du prix d'un outil neuf, ou si le moteur a chauffé, le remplacement est plus économique que la réparation.",
        ],
      },
    ],
  },
  {
    slug: 'guide-securite-chantier',
    title: 'Sécurité sur les chantiers',
    category: 'Sécurité',
    type: 'Guide',
    summary:
      "Les règles de sécurité essentielles pour l'usage des outils électroportatifs : EPI, électricité, découpe et travail en hauteur.",
    sections: [
      {
        heading: 'Équipements de protection individuelle',
        paragraphs: [
          "Lunettes de protection, gants adaptés, protection auditive, chaussures de sécurité et masque anti-poussière sont obligatoires selon l'outil. Sur un chantier, l'EPI n'est pas optionnel.",
        ],
      },
      {
        heading: 'Risque électrique',
        paragraphs: [
          "Utilisez un disjoncteur différentiel et des rallonges de section suffisante. Ne travaillez jamais avec un câble endommagé. Pour l'extérieur, privilégiez les outils de classe II ou alimentés par batterie.",
        ],
      },
      {
        heading: 'Découpe et meulage',
        paragraphs: [
          "Montez toujours le carter, respectez le sens de rotation et la vitesse maximale du disque. Ne retirez jamais le protecteur : c'est la première cause d'accident grave.",
        ],
      },
      {
        heading: 'Travail en hauteur',
        paragraphs: [
          "Stabilisez l'échelle ou l'échafaudage, gardez les deux mains libres quand c'est possible et ne tirez jamais sur le câble d'un outil pour vous rattraper.",
        ],
      },
    ],
  },
  {
    slug: 'comparatif-batteries',
    title: 'Comparatif batteries 12V vs 20V',
    category: 'Outils Sans Fil',
    type: 'Fiche technique',
    summary:
      "Comprendre la tension, la capacité (Ah) et l'autonomie réelle pour choisir la bonne plateforme de batteries sans fil.",
    sections: [
      {
        heading: 'Tension : 12V ou 20V ?',
        paragraphs: [
          "Le 12V est léger et compact, parfait pour le perçage léger et le vissage. Le 20V offre plus de couple et d'autonomie pour les travaux intensifs, au prix d'un poids supérieur.",
        ],
      },
      {
        heading: 'Capacité et autonomie',
        paragraphs: [
          "La capacité en Ah détermine l'autonomie. Une batterie 2,0 Ah convient à un usage ponctuel, une 4,0 Ah ou 5,0 Ah aux chantiers longs. À tension égale, plus d'Ah signifie plus de temps de travail mais aussi plus de poids.",
        ],
      },
      {
        heading: 'Compatibilité et charge',
        paragraphs: [
          "Rester sur une même plateforme permet de partager batteries et chargeurs entre plusieurs outils. Les chargeurs rapides réduisent le temps d'immobilisation ; vérifiez toujours la compatibilité tension/chargeur.",
        ],
      },
    ],
  },
  {
    slug: 'guide-tronconneuse',
    title: "Guide d'achat: Tronçonneuse",
    category: 'Jardinage',
    type: 'Guide',
    summary:
      "Thermique, électrique ou à batterie : comment choisir une tronçonneuse adaptée à votre usage et l'entretenir correctement.",
    sections: [
      {
        heading: 'Choisir le type de motorisation',
        paragraphs: [
          "La tronçonneuse thermique convient aux gros travaux en extérieur loin d'une prise. L'électrique filaire est idéale pour l'élagage domestique à proximité d'une alimentation. La version à batterie offre le meilleur compromis bruit, entretien et mobilité pour un jardin.",
        ],
      },
      {
        heading: 'Longueur de guide et puissance',
        paragraphs: [
          "Un guide de 30 à 35 cm suffit pour l'élagage et le petit abattage. Au-delà de 40 cm, une motorisation plus puissante est nécessaire pour ne pas forcer le moteur.",
        ],
      },
      {
        heading: 'Entretien de la chaîne',
        paragraphs: [
          "Affûtez la chaîne régulièrement, contrôlez la tension avant chaque usage et lubrifiez avec une huile adaptée. Une chaîne mal tendue abîme le guide et fatigue le moteur.",
        ],
      },
      {
        heading: 'Sécurité',
        paragraphs: [
          "Portez toujours une protection auditive, des lunettes et des gants anti-coupure. Vérifiez le frein de chaîne avant chaque démarrage et ne travaillez jamais en hauteur sur une échelle.",
        ],
      },
    ],
  },
]

export function getResource(slug: string): TrainingResource | undefined {
  return TRAINING_RESOURCES.find((r) => r.slug === slug)
}
