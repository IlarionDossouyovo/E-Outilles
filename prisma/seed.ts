import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const prisma = new PrismaClient()

// Categories data - INGCO Product Categories
const categories = [
  {
    id: 'power-tools',
    name: 'Outils Électriques',
    slug: 'power-tools',
    description: 'Perceuses, Meuleuses, Scies, Marteau perforateur',
    icon: '⚡',
    color: '#EF4444'
  },
  {
    id: 'hand-tools',
    name: 'Outils à Main',
    slug: 'hand-tools',
    description: 'Clés, Tournevis, Pinces, Marteaux',
    icon: '🔧',
    color: '#3B82F6'
  },
  {
    id: 'measuring',
    name: 'Mesure & Niveau',
    slug: 'measuring',
    description: 'Niveaux laser, Mètres, Détecteurs',
    icon: '📏',
    color: '#8B5CF6'
  },
  {
    id: 'garden',
    name: 'Jardinage',
    slug: 'garden',
    description: 'Tondeuses, Tronçonneuses, Taille-haies',
    icon: '🌿',
    color: '#22C55E'
  },
  {
    id: 'automotive',
    name: 'Automobile',
    slug: 'automotive',
    description: 'Crics, Chandelles, Démonte-valves, Extracteurs',
    icon: '🚗',
    color: '#F97316'
  },
  {
    id: 'drilling',
    name: 'Forage & Découpe',
    slug: 'drilling',
    description: 'Burins, Scies trépans, Disques',
    icon: '🔩',
    color: '#6B7280'
  },
  {
    id: 'safety',
    name: 'Sécurité',
    slug: 'safety',
    description: 'Casques, Gants, Lunettes, Chaussures',
    icon: '🦺',
    color: '#EAB308'
  },
  {
    id: 'storage',
    name: 'Rangement',
    slug: 'storage',
    description: 'Caisses à outils, Armoires, Coffrets',
    icon: '🧰',
    color: '#14B8A6'
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
    categoryId: 'power-tools'
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
    categoryId: 'power-tools'
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
    categoryId: 'power-tools'
  },
  // Hand Tools - Outils à Main
  {
    name: 'Clé à pipe 12 pans',
    slug: 'cle-pipe-12',
    description: 'Clé à pipe 12 pans professionnelle. Chrome vanadium. 10-24mm. 10 pièces.',
    price: 49.99,
    comparePrice: 69.99,
    sku: 'HT-WREN-001',
    stock: 120,
    images: '["/products/cle-pipe.jpg"]',
    features: '["Chrome vanadium","10-24mm","10 pièces","Poli miroir"]',
    categoryId: 'hand-tools'
  },
  {
    name: 'Tournevis cruciforme précision',
    slug: 'tournevis-precision',
    description: 'Set de tournevis précision 32 pièces. Pour électronique et précision.',
    price: 29.99,
    comparePrice: 39.99,
    sku: 'HT-SCREW-001',
    stock: 200,
    images: '["/products/tournevis.jpg"]',
    features: '["32 pièces","Aimantés","Poignée Soft","Résistance 1000V"]',
    categoryId: 'hand-tools'
  },
  {
    name: 'Pince multiprise professionnelle',
    slug: 'pince-multiprise',
    description: 'Pince multiprise professionnelle REG. 10 положений. Chrome vanadium.',
    price: 34.99,
    comparePrice: 44.99,
    sku: 'HT-PLIER-001',
    stock: 150,
    images: '["/products/pince.jpg"]',
    features: '["10 positions","REG","Chrome vanadium","Grip confortable"]',
    categoryId: 'hand-tools'
  },
  {
    name: 'Marteau de charpentier 500g',
    slug: 'marteau-charpentier',
    description: 'Marteau de charpentier professionnel 500g. Tête forgée. Manche Hickory.',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'HT-HAMM-001',
    stock: 180,
    images: '["/products/marteau.jpg"]',
    features: '["500g","Tête forgée","Manche Hickory","Anti-vibration"]',
    categoryId: 'hand-tools'
  },
  {
    name: 'Scie à métaux professionnelle',
    slug: 'scie-metaux',
    description: 'Scie à métaux professionnelle avec lame bi-métal. Cadre en acier.',
    price: 19.99,
    comparePrice: 29.99,
    sku: 'HT-SAW-001',
    stock: 100,
    images: '["/products/scie.jpg"]',
    features: '["Lame bi-métal","Cadre acier","Lame 300mm","Réglage rapide"]',
    categoryId: 'hand-tools'
  },
  // Drilling - Forage & Découpe
  {
    name: 'Kit burins SDS Plus 5 pièces',
    slug: 'kit-burins-sds',
    description: 'Kit de burins SDS Plus professionnel. 5 pièces: pointu, plat, crevasse.',
    price: 39.99,
    comparePrice: 49.99,
    sku: 'DRL-CHIS-001',
    stock: 80,
    images: '["/products/burins.jpg"]',
    features: '["SDS Plus","5 pièces","Tungstène","Longue durée"]',
    categoryId: 'drilling'
  },
  {
    name: 'Disque à tronçonner métal 230mm',
    slug: 'disque-tronconner',
    description: 'Disque à tronçonner professionnel métal. Diamètre 230mm. Vitesse max 80m/s.',
    price: 9.99,
    comparePrice: 14.99,
    sku: 'DRL-DISC-001',
    stock: 500,
    images: '["/products/disque.jpg"]',
    features: '["230mm","Métal","80m/s max","Épaisseur 3mm"]',
    categoryId: 'drilling'
  },
  {
    name: 'Scie trépans Carbure 68mm',
    slug: 'scie-trepan',
    description: 'Scie trépans carbure professionnelle. Pour perceuse. Diamètre 68mm.',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'DRL-HOLE-001',
    stock: 60,
    images: '["/products/trepan.jpg"]',
    features: '["68mm","Carbure","Perceuse","Coupe propre"]',
    categoryId: 'drilling'
  },
  // Measuring
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
    categoryId: 'measuring'
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
    categoryId: 'measuring'
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
    categoryId: 'measuring'
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
    categoryId: 'automotive'
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
    categoryId: 'automotive'
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
    categoryId: 'automotive'
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
    categoryId: 'garden'
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
    categoryId: 'garden'
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
    categoryId: 'garden'
  },
  // Additional Construction products
  {
    name: 'Meuleuse angulaire 230V 2200W',
    slug: 'meuleuse-230v-2200w',
    description: 'Meuleuse professionnelle 230V 2200W. Disque 230mm. Variateur de vitesse.',
    price: 159.99,
    comparePrice: 199.99,
    sku: 'BOS-MEU-001',
    stock: 55,
    images: '["/products/meuleuse-230.jpg"]',
    features: '["2300W","230mm","Variateur","Protection poussières"]',
    categoryId: 'power-tools'
  },
  {
    name: 'Scie circulaire 1900W',
    slug: 'scie-circulaire-1900w',
    description: 'Scie circulaire professionnelle 1900W. Profondeur de coupe 66mm à 90°.',
    price: 129.99,
    comparePrice: 169.99,
    sku: 'DEW-SCI-001',
    stock: 40,
    images: '["/products/scie-circulaire.jpg"]',
    features: '["1900W","66mm coupe","190mm disque","Guide parallèle"]',
    categoryId: 'power-tools'
  },
  {
    name: 'Escabeau professionnel 8 marches',
    slug: 'escabeau-8-marches',
    description: 'Escabeau professionnel aluminium 8 marches. Plateforme antidérapante. Hauteur max 3.5m.',
    price: 89.99,
    comparePrice: 119.99,
    sku: 'HUM-ESC-001',
    stock: 80,
    images: '["/products/escabeau.jpg"]',
    features: '["8 marches","3.5m hauteur","150kg charge","Antidérapant"]',
    categoryId: 'power-tools'
  },
  {
    name: 'Disqueuse pneumatique droite',
    slug: 'disqueuse-pneumatique',
    description: 'Disqueuse pneumatique droite professionnelle. Vitesse à vide 22000 tr/min.',
    price: 79.99,
    comparePrice: 99.99,
    sku: 'ING-DIS-001',
    stock: 65,
    images: '["/products/disqueuse-pneu.jpg"]',
    features: '["22000 tr/min","50mm disque","Pneumatique","Poignée latérale"]',
    categoryId: 'power-tools'
  },
  {
    name: 'Coffret burins SDS-Plus 10 pièces',
    slug: 'coffret-burins-sds',
    description: 'Coffret de burins SDS-Plus 10 pièces. Pour béton et pierre.',
    price: 34.99,
    comparePrice: 44.99,
    sku: 'BOS-BUR-001',
    stock: 120,
    images: '["/products/burins-sds.jpg"]',
    features: '["10 pièces","SDS-Plus","Pour béton","Longue durée"]',
    categoryId: 'power-tools'
  },
  // Additional Electricité products
  {
    name: 'Pince à sertir hydraulique',
    slug: 'pince-sertir-hydraulique',
    description: 'Pince à sertir hydraulique professionnelle pour cables 16-300mm².',
    price: 249.99,
    comparePrice: 319.99,
    sku: 'KL-SERT-001',
    stock: 35,
    images: '["/products/pince-sertir.jpg"]',
    features: '["16-300mm²","Tête rotative","Hydraulique","Mallette"]',
    categoryId: 'measuring'
  },
  {
    name: 'Testeur de tension sans contact',
    slug: 'testeur-tension-ncv',
    description: 'Testeur de tension sans contact NCV. Détection 12-1000V AC.',
    price: 19.99,
    comparePrice: 29.99,
    sku: 'FLU-NCV-001',
    stock: 200,
    images: '["/products/testeur-ncv.jpg"]',
    features: '["12-1000V","NCV","LED","Bip sonore"]',
    categoryId: 'measuring'
  },
  {
    name: 'Pince ampèremétrique True-RMS',
    slug: 'pince-amperemetrique',
    description: 'Pince ampèremétrique professionnelle True-RMS. Mesure jusqu à 1000A.',
    price: 149.99,
    comparePrice: 189.99,
    sku: 'FLU-PIN-001',
    stock: 45,
    images: '["/products/pince-amp.jpg"]',
    features: '["1000A AC/DC","True-RMS","TRMS","Écran rétro"]',
    categoryId: 'measuring'
  },
  {
    name: 'Câble de testerman 5m',
    slug: 'cable-testerman-5m',
    description: 'Set de cables de testerman 5m. Paires rouge/noir. Fiches bananes 4mm.',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'TEST-CAB-001',
    stock: 250,
    images: '["/products/cables-test.jpg"]',
    features: '["5m","Rouge/Noir","4mm bananes","Qualité pro"]',
    categoryId: 'measuring'
  },
  {
    name: 'Lampe torche inspection LED',
    slug: 'lampe-torche-led',
    description: 'Lampe torche inspection LED rechargeable. 500 lumens. Tête flexible.',
    price: 39.99,
    comparePrice: 49.99,
    sku: 'LED-LAM-001',
    stock: 150,
    images: '["/products/lampe-led.jpg"]',
    features: '["500 lumens","Rechargeable","Tête flexible","Crochet"]',
    categoryId: 'measuring'
  },
  // Additional Garage products
  {
    name: 'Presse hydraulique 20T',
    slug: 'presse-hydraulique-20t',
    description: 'Presse hydraulique professionnelle 20 tonnes. Course piston 250mm.',
    price: 599.99,
    comparePrice: 749.99,
    sku: 'RAV-PRES-001',
    stock: 15,
    images: '["/products/presse-20t.jpg"]',
    features: '["20 tonnes","250mm course","1500mm largeur","Hydraulique"]',
    categoryId: 'automotive'
  },
  {
    name: 'Démonte-valve pneumatique',
    slug: 'demonte-valve-pneu',
    description: 'Kit démonte-valve pneumatique professionnel. Pour tous types de valves.',
    price: 49.99,
    comparePrice: 69.99,
    sku: 'RAV-VAL-001',
    stock: 90,
    images: '["/products/demonte-valve.jpg"]',
    features: '["Pneumatique","Tous valves","Rapide","Complet"]',
    categoryId: 'automotive'
  },
  {
    name: 'Extracteur de roulements 6 pièces',
    slug: 'extracteur-roulements',
    description: 'Kit extracteur de roulements 6 pièces. Capacité 30-90mm. Acier forgé.',
    price: 79.99,
    comparePrice: 99.99,
    sku: 'ING-EXT-001',
    stock: 55,
    images: '["/products/extracteur.jpg"]',
    features: '["6 pièces","30-90mm","Acier forgé","3 griffes"]',
    categoryId: 'automotive'
  },
  {
    name: 'Jeu de cales d\'épaisseur 24 pièces',
    slug: 'cales-epaisseur-24',
    description: 'Jeu de cales d\'épaisseur métriques 24 pièces. Acier trempé.',
    price: 44.99,
    comparePrice: 59.99,
    sku: 'STA-CAL-001',
    stock: 100,
    images: '["/products/cales.jpg"]',
    features: '["24 pièces","Métriques","Classe 1","Étui bois"]',
    categoryId: 'automotive'
  },
  {
    name: 'Chandelle de sécurité 3T paire',
    slug: 'chandelle-securite-3t',
    description: 'Paire de chandelles de sécurité 3 tonnes. Hauteur 280-420mm.',
    price: 69.99,
    comparePrice: 89.99,
    sku: 'RAV-CHAN-001',
    stock: 75,
    images: '["/products/chandelles.jpg"]',
    features: '["3T","280-420mm","Paire","Robuste"]',
    categoryId: 'automotive'
  },
  // Additional Jardinage products
  {
    name: 'Souffleur de feuilles 2 temps',
    slug: 'souffleur-2-temps',
    description: 'Souffleur de feuilles thermique 2 temps 75cc. Débit d\'air 900m³/h.',
    price: 249.99,
    comparePrice: 319.99,
    sku: 'STIH-SOU-001',
    stock: 30,
    images: '["/products/souffleur.jpg"]',
    features: '["75cc","900m³/h","50L sac","2 temps"]',
    categoryId: 'garden'
  },
  {
    name: 'Tronçonneuse thermique 50cm',
    slug: 'tronconneuse-50cm',
    description: 'Tronçonneuse professionnelle 50cm. Moteur 55cc. Vitesse chaîne 20m/s.',
    price: 449.99,
    comparePrice: 549.99,
    sku: 'HUS-TRON-001',
    stock: 20,
    images: '["/products/tronconneuse.jpg"]',
    features: '["55cc","50cm","20m/s","EasyStart"]',
    categoryId: 'garden'
  },
  {
    name: 'Motoculteur thermique 7CV',
    slug: 'motoculteur-7cv',
    description: 'Motoculteur thermique 7CV. Largeur de travail 80cm. 4 vitesses.',
    price: 799.99,
    comparePrice: 999.99,
    sku: 'BEN-MOTO-001',
    stock: 10,
    images: '["/products/motoculteur.jpg"]',
    features: '["7CV","80cm largeur","4 vitesses","Fraises"]',
    categoryId: 'garden'
  },
  {
    name: 'Pulvérisateur pressurisé 12L',
    slug: 'pulverisateur-12l',
    description: 'Pulvérisateur pressurisé 12 litres. Lance telescopique. Buse regulable.',
    price: 39.99,
    comparePrice: 49.99,
    sku: 'GARD-PUL-001',
    stock: 80,
    images: '["/products/pulverisateur.jpg"]',
    features: '["12L","Lance telescopique","Buse regulable","Joints pro"]',
    categoryId: 'garden'
  },
  {
    name: 'Sécateur électrique sur batterie',
    slug: 'secateur-electrique',
    description: 'Sécateur électrique professionnel sur batterie 18V. Coupe jusqu à 25mm.',
    price: 189.99,
    comparePrice: 239.99,
    sku: 'STIH-SEC-001',
    stock: 40,
    images: '["/products/secateur.jpg"]',
    features: '["18V","25mm coupe","8h autonomie","Professionnel"]',
    categoryId: 'garden'
  },
  // Safety - Équipements de Protection
  {
    name: 'Casque de sécurité ABS',
    slug: 'casque-securite-abs',
    description: 'Casque de sécurité professionnel ABS. Protection contre les chocs. Aéré et confortable.',
    price: 24.99,
    comparePrice: 34.99,
    sku: 'SAF-HEL-001',
    stock: 150,
    images: '["/products/casque.jpg"]',
    features: '["ABS","Aéré","Jugulaire","Norme EN397"]',
    categoryId: 'safety'
  },
  {
    name: 'Gants de travail anti-coupure',
    slug: 'gants-anti-coupure',
    description: 'Gants professionnels anti-coupure niveau 5. Protection maximale pour travaux dangereux.',
    price: 19.99,
    comparePrice: 29.99,
    sku: 'SAF-GLO-001',
    stock: 300,
    images: '["/products/gants.jpg"]',
    features: '["Niveau 5","Anti-coupure","Souple","Durable"]',
    categoryId: 'safety'
  },
  {
    name: 'Lunettes de protection transparentes',
    slug: 'lunettes-protection',
    description: 'Lunettes de protection anti-buée traitées. Protection UV et impacts.',
    price: 12.99,
    comparePrice: 18.99,
    sku: 'SAF-GOG-001',
    stock: 500,
    images: '["/products/lunettes.jpg"]',
    features: '["Anti-buée","UV400","Impacts","Légère"]',
    categoryId: 'safety'
  },
  {
    name: 'Chaussures de sécurité SRC',
    slug: 'chaussures-securite-src',
    description: 'Chaussures de sécurité professionnelles SRC. Semelle antidérapante, coque acier.',
    price: 59.99,
    comparePrice: 79.99,
    sku: 'SAF-SHO-001',
    stock: 100,
    images: '["/products/chaussures.jpg"]',
    features: '["SRC","Coque acier","Antidérapante","Semelle coussinée"]',
    categoryId: 'safety'
  },
  {
    name: 'Gilet réfléchissant haute visibilité',
    slug: 'gilet-reflechissant',
    description: 'Gilet haute visibilité jaune fluo avec bandes réfléchissantes. Norme EN471.',
    price: 14.99,
    comparePrice: 19.99,
    sku: 'SAF-VES-001',
    stock: 200,
    images: '["/products/gilet.jpg"]',
    features: '["EN471","2 bandes","Fermeture velcro","Tailles S-3XL"]',
    categoryId: 'safety'
  },
  {
    name: 'Protection auditive antibruit',
    slug: 'protection-auditive',
    description: 'Arceau antibruit SNR 28dB. Réduction du bruit professionnelle.',
    price: 9.99,
    comparePrice: 14.99,
    sku: 'SAF-EAR-001',
    stock: 250,
    images: '["/products/ear.jpg"]',
    features: '["SNR 28dB","Arceau","Régable","Confortable"]',
    categoryId: 'safety'
  },
  // Storage - Rangement et Organisation
  {
    name: 'Caisse à outils professionnelle 21 pouces',
    slug: 'caisse-outils-21',
    description: 'Caisse à outils robuste 21 pouces. Compartiments ajustables. Résistante aux chocs.',
    price: 49.99,
    comparePrice: 69.99,
    sku: 'STO-BOX-001',
    stock: 80,
    images: '["/products/caisse.jpg"]',
    features: '["21 pouces","Résistante","Compartiments","Fermeture sécurisée"]',
    categoryId: 'storage'
  },
  {
    name: 'Coffret outils 186 pièces',
    slug: 'coffret-186-piece',
    description: 'Coffret complet 186 pièces. Clés, tournevis, pinces. Qualité professionnelle.',
    price: 129.99,
    comparePrice: 179.99,
    sku: 'STO-KIT-001',
    stock: 45,
    images: '["/products/coffret.jpg"]',
    features: '["186 pièces","Chrome vanadium","Sac de transport","Garantie 2 ans"]',
    categoryId: 'storage'
  },
  {
    name: 'Armoire à outils mobile',
    slug: 'armoire-mobile',
    description: 'Armoire à outils sur roulettes. 5 tiroirs. Plateau de travail intégré.',
    price: 199.99,
    comparePrice: 279.99,
    sku: 'STO-CAB-001',
    stock: 25,
    images: '["/products/armoire.jpg"]',
    features: '["5 tiroirs","Roulettes","Plateau","Verrouillable"]',
    categoryId: 'storage'
  },
  {
    name: 'Valise de transport outils',
    slug: 'valise-transport',
    description: 'Valise de transport robuste pour outils électriques. Imperméable et antichoc.',
    price: 39.99,
    comparePrice: 54.99,
    sku: 'STO-CAS-001',
    stock: 120,
    images: '["/products/valise.jpg"]',
    features: '["Imperméable","Antichoc","Poignée","Sangle"]',
    categoryId: 'storage'
  },
  {
    name: 'Plateau magnétique pour outils',
    slug: 'plateau-magnetique',
    description: 'Plateau magnétique puissant pour garder vos outils en place. Surface antidérapante.',
    price: 29.99,
    comparePrice: 39.99,
    sku: 'STO-MAG-001',
    stock: 90,
    images: '["/products/magnet.jpg"]',
    features: '["Magnétique","Antidérapant","Washable","Grand format"]',
    categoryId: 'storage'
  },
  {
    name: 'Ceinture porte-outils',
    slug: 'ceinture-porte-outils',
    description: 'Ceinture professionnelle porte-outils. Multiples pochettes. Réglable.',
    price: 34.99,
    comparePrice: 44.99,
    sku: 'STO-BELT-001',
    stock: 70,
    images: '["/products/ceinture.jpg"]',
    features: '["Régtable","Multi pochettes","Durable","Confortable"]',
    categoryId: 'storage'
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
    categoryId: 'power-tools'
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
    categoryId: 'measuring'
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
    categoryId: 'automotive'
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
    categoryId: 'garden'
  },
  // Additional blog posts - Services
  {
    title: 'Pourquoi choisir la location d\'outils?',
    slug: 'pourquoi-choisir-location-outils',
    content: `La location d'outils est une solution intelligente pour les professionnels et particuliers.

## Avantages de la location:

### Économie
- Pas d'investissement initial important
- Pas de frais de maintenance
- Payez uniquement pour l'utilisation

### Flexibilité
- Accès au matériel最新
- Changement selon les besoins
- Pas de stockage

### Services inclus
- Livraison sur chantier
- Formation à l'utilisation
- Support technique

## Quand louer?

- **Projets ponctuels**: Une seule fois
- **Essai avant achat**: Tester avant d'investir
- **Pic d'activité**: Besoin temporaire supplémentaire
- **Travaux spécialisés**: Équipement rare

Chez E-Outilles, nous proposons des tarifs flexibles et un service de livraison gratuit.`,
    excerpt: 'Découvrez les avantages de la location d\'outils pour vos projets.',
    image: '/blog/location-outils.jpg',
    author: 'Équipe E-Outilles',
    category: 'Services',
    published: true,
    featured: false,
    categoryId: 'power-tools'
  },
  {
    title: 'Maintenance préventive de vos outils',
    slug: 'maintenance-preventive-outils',
    content: `La maintenance préventive prolonge la vie de vos outils et garantit leur performance.

## Entretien régulier:

### Après chaque utilisation
- Nettoyer les poussières
- Vérifier l'état des câbles
- Graisser les parties mobiles

### Hebdomadaire
- Contrôler les batteries
- Vérifier les filtre
- Tester les dispositifs de sécurité

### Mensuel
- Affûter les lames
- Vérifier les consommables
- Contrôler les vitesses

## Signes d'usure:
- Bruit anormal
- Perte de puissance
- Vibration excessive
- Chauffe anormale

Notre service de maintenance offre un diagnostic gratuit et des pièces authentiques.`,
    excerpt: 'Guide pour entretenir vos outils et prolonger leur durée de vie.',
    image: '/blog/maintenance-outils.jpg',
    author: 'Équipe E-Outilles',
    category: 'Services',
    published: true,
    featured: false,
    categoryId: 'power-tools'
  },
  {
    title: 'Guide livraison: Comment ça marche?',
    slug: 'guide-livraison-e-outilles',
    content: `Tout savoir sur notre service de livraison rapide au Benin.

## Zones de livraison:
- **Cotonou**: Livraison le jour même
- **Sud Benin**: 24-48h
- **Autres régions**: 3-5 jours

## Options de livraison:
1. **Standard**: 48-72h, 5€
2. **Express**: 24h, 10€
3. **Premium**: Same day, 15€

## Suivi de commande:
- SMS de confirmation
- Notification de départ
- Estimation du créneau

## Emballage:
- Tous nos colis sont protégés
- Assurance incluse
- Signature à réception

Vérifiez votre adresse et téléphone pour une livraison rapide!`,
    excerpt: 'Découvrez comment fonctionne notre service de livraison.',
    image: '/blog/livraison.jpg',
    author: 'Équipe E-Outilles',
    category: 'Services',
    published: true,
    featured: false,
    categoryId: 'power-tools'
  },
  {
    title: 'Formation outils: Optimisez vos compétences',
    slug: 'formation-outils-competences',
    content: `Nos formations vous aident à maîtriser vos équipements.

## Types de formations:

### Initiation
- Sécurité de base
- Manipulation des outils
- Entretien quotidien

### Avancé
- Techniques professionnelles
- Optimisation du rendement
- Maintenance avancées

### Sur mesure
- Selon votre métier
- Sur votre équipement
- À votre rythme

## Nos formateurs:
- Experts certifiés
- 10+ ans d'expérience
- Pédagogie adaptée

## Attestation:
Toutes nos formations délivrent un certificat reconnu.`,
    excerpt: 'Améliorez vos compétences avec nos formations.',
    image: '/blog/formation.jpg',
    author: 'Équipe E-Outilles',
    category: 'Services',
    published: true,
    featured: false,
    categoryId: 'power-tools'
  },
  {
    title: 'Consultation technique: Besoin d\'avis expert?',
    slug: 'consultation-technique-expert',
    content: `Nos experts vous accompagnent dans vos projets.

## Notre service de consultation:

### Gratuit et sans engagement
- Analyse de vos besoins
- Recommandations personnalisées
- Devis détaillé

### Nos domaines d'expertise:
- Choix d'équipements
- Optimisation d'atelier
- Sécurité sur chantier
- Techniques d'installation

### Comment en bénéficier?
1. Prenez rendez-vous
2. Décrivez votre projet
3. Recevez nos recommandations

## Pourquoi nous faire confiance?
- 15 ans d'expérience
- +500 clients satisfaits
- Partenaires des grandes marques`,
    excerpt: 'Bénéficiez de nos conseils d\'experts.',
    image: '/blog/consultation.jpg',
    author: 'Équipe E-Outilles',
    category: 'Services',
    published: true,
    featured: false,
    categoryId: 'power-tools'
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