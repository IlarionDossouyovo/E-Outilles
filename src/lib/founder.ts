// Single source of truth for the founder profile (page /fondateur + agent dashboard).

export interface FounderMilestone {
  year: string
  title: string
  description: string
}

export interface FounderValue {
  icon: 'shield' | 'zap' | 'check' | 'star' | 'tools' | 'truck'
  title: string
  description: string
}

export interface FounderExpertise {
  icon: 'grid' | 'tools' | 'card' | 'truck' | 'chat' | 'settings'
  title: string
  description: string
}

export const FOUNDER = {
  fullName: 'DOSSOU-YOVO ATTIOGBE Yélian Auguste Ilarion',
  name: 'Ilarion DOSSOU-YOVO ATTIOGBE',
  shortName: 'Ilarion Dossou-Yovo',
  initials: 'ID',
  role: 'Fondateur & PDG',
  email: 'ilarion@e-outilles.com',
  phone: '+229 01 977 003 47',
  whatsapp: '+229 01 977 003 47',
  since: '2024',
  location: 'Cotonou, Bénin',
  company: 'E-Outilles par ELECTRON',
  vision:
    "Démocratiser l'accès aux outils professionnels de qualité pour tous les artisans du monde.",
  tagline: "De l'idée au terrain : rendre l'outillage pro accessible à chaque artisan africain.",
  bio: [
    "Entrepreneur béninois basé à Cotonou, Ilarion Dossou-Yovo Attiogbé fonde E-Outilles en 2024 avec une conviction simple : un artisan ne devrait jamais choisir entre la qualité de ses outils et la rentabilité de son activité.",
    "En s'appuyant sur un partenariat direct avec le fabricant INGCO et une chaîne logistique optimisée entre l'Asie et l'Afrique de l'Ouest, il transforme le dropshipping en un modèle vertueux : pas de stock initial pour le revendeur, des prix justes pour le client final et une qualité professionnelle garantie.",
    "De la sélection des gammes à la formation des revendeurs, il pilote aujourd'hui le développement produit, les partenariats et l'expansion régionale de la plateforme.",
  ] as string[],
  milestones: [
    { year: '2024', title: 'Naissance du projet', description: "Identification du besoin d'outillage professionnel abordable pour les artisans d'Afrique francophone." },
    { year: '2024', title: 'Partenariat INGCO', description: "Signature d'un approvisionnement direct auprès du fabricant et lancement du catalogue E-Outilles." },
    { year: '2025', title: 'Plateforme en ligne', description: 'Mise en production de la boutique e-commerce, du paiement sécurisé et du programme revendeurs.' },
    { year: '2025', title: 'Expansion régionale', description: "Ouverture de la livraison vers le Bénin, le Sénégal, la Côte d'Ivoire, le Cameroun et au-delà." },
  ] as FounderMilestone[],
  expertise: [
    { icon: 'grid', title: 'Stratégie produit', description: "Sélection des gammes, sourcing et négociation avec les fabricants." },
    { icon: 'tools', title: 'Expertise outillage', description: "Connaissance métier des outils électroportatifs, à main et de leurs usages." },
    { icon: 'truck', title: 'Logistique internationale', description: "Approvisionnement Asie–Afrique et optimisation des délais de livraison." },
    { icon: 'card', title: 'Commerce & paiements', description: "Modèle dropshipping, intégration des paiements et de la facturation." },
    { icon: 'chat', title: 'Relation client & formation', description: "Accompagnement des revendeurs et formation à l'usage des outils." },
    { icon: 'settings', title: 'Développement digital', description: "Pilotage de la plateforme e-commerce, de l'IA et de l'expérience utilisateur." },
  ] as FounderExpertise[],
  values: [
    { icon: 'shield', title: 'Confiance', description: 'Des relations durables et transparentes.' },
    { icon: 'zap', title: 'Rapidité', description: 'Une logistique pensée pour le terrain.' },
    { icon: 'check', title: 'Qualité', description: 'Des produits professionnels certifiés.' },
    { icon: 'star', title: 'Impact', description: "L'autonomie des artisans avant tout." },
  ] as FounderValue[],
} as const

export function founderMailto(subject = 'Contact depuis le site E-Outilles'): string {
  return `mailto:${FOUNDER.email}?subject=${encodeURIComponent(subject)}`
}

export function founderTel(): string {
  return `tel:${FOUNDER.phone.replace(/\s/g, '')}`
}

export function founderWhatsApp(message = 'Bonjour, je souhaite échanger avec le fondateur.'): string {
  return `https://wa.me/${FOUNDER.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`
}
