# 🚀 E-Outilles - Guide d'Installation

## 📁 Structure du Projet

```
E-Outilles/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── cart/              # Page panier
│   │   ├── wishlist/          # Page wishlist
│   │   ├── search/           # Recherche produits
│   │   ├── blog/             # Blog marketing
│   │   ├── auth/            # Login / Register
│   │   ├── profile/         # Profil utilisateur
│   │   ├── admin/           # Dashboard admin
│   │   └── api/            # Routes API
│   │       └── payments/     # Stripe payments
│   └── lib/
│       ├── store/            # Zustand stores (cart, wishlist)
│       ├── payments/        # Paiements (Stripe, MTN, Orange)
│       ├── security/        # Auth, GDPR, Rate limit
│       ├── marketing/       # Newsletter, IA marketing
│       └── ai/             # Chatbot widget
├── public/                  # Assets statiques (PWA)
├── package.json             # Dépendances
├── tailwind.config.js      # Configuration Tailwind
├── next.config.js         # Configuration Next.js
└── tsconfig.json         # Configuration TypeScript
```

---

## 🖥️ Installation sur Votre Machine (Windows)

### Prérequis

| Logiciel | Version | Lien |
|----------|---------|------|
| Node.js | 18+ | [Télécharger](https://nodejs.org/) |
| npm | 10+ | Inclus avec Node.js |

### Étape 1: Préparation

```powershell
# Ouvrir PowerShell ou Terminal dans le dossier du projet
cd "C:\Users\AUGUSTIN\OneDrive\Documents\E-Outille\E-Outilles-main"

# OU utiliser le script automatique
.\setup.bat
```

### Étape 2: Installation manuelle

```powershell
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
copy .env.example .env

# 3. Modifier .env avec vos clés API
notepad .env
```

### Étape 3: Configuration Stripe

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Allez dans **Developers > API Keys**
3. Copiez vos clés dans le fichier `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Étape 4: Lancer le projet

```powershell
# Mode développement (avec hot reload)
npm run dev

# OU Mode production
npm run build
npm start
```

Le site sera accessible sur: **http://localhost:3000**

---

## 🔧 Commandes Utiles

| Commande | Description |
|---------|------------|
| `npm run dev` | Démarrer en mode développement |
| `npm run build` | Compiler pour production |
| `npm run start` | Lancer le serveur de production |
| `npm run lint` | Vérifier le code |

---

## 📦 Dépendances Installées

### Production
- `next` (14.1.0) - Framework React
- `react` (18.2.0) - UI Library
- `stripe` (22.0.2) - Paiements
- `zustand` (5.0.12) - State management

### Développement
- `typescript` (5.3.0) - Type safety
- `tailwindcss` (3.4.0) - Styling
- `eslint` - Linting

---

## ✅ Phases Implémentées

### Phase 1 - Backend ✅
- [x] Setup SQLite + Prisma
- [x] API REST produits/commandes/catégories
- [x] Base de données avec schéma complet

### Phase 2 - Checkout ✅
- [x] Page produit détaillée (/produit-detail-page/[id])
- [x] Flow panier → checkout existant
- [x] Gestion commandes API

### Phase 3 - Paiements ✅
- [x] Stripe intégration
- [ ] Stripe Webhooks (À implémenter)
- [ ] Intégration MTN/Moov/Orange (Optionnel)

### Phase 4 - Logo & Identité ✅
- [x] Logo "E-Outille By ELECTRON"
- [x] Icône avec éclateur (⚡) + engrenage
- [x] Versions: horizontal, vertical, icône seule
- [x] Couleurs: yellow (#FFC400), noir (#121212)

---

## ⚠️ Prochaines Étapes (Roadmap)

### Phase 5 - Configuration Finale
- [ ] Configurer .env avec clés Stripe réelles
- [ ] Lancer `npm run dev`
- [ ] Tester le site sur http://localhost:3004

### Phase 6 - Paiements Locaux (Optionnel)
- [ ] Stripe Webhooks pour confirmation
- [ ] Intégration MTN Mobile Money
- [ ] Intégration Orange Money

---

## 🆘 Dépannage

### Erreur "port already in use"
```powershell
# Trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur Node.js non trouvé
- Redémarrez votre terminal après installation de Node.js
- Ou ajoutez Node.js au PATH système

### Erreur Stripe
- Vérifiez que vos clés dans `.env` sont correctes
- Utilisez les clés de test (sk_test_...) pour le développement

---

## 📞 Support

Pour toute question, consultez la documentation Next.js:
https://nextjs.org/docs