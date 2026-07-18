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

Le site sera accessible sur: **http://localhost:3003**

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

## ✅ Phases Implémentées (100%)

### Phase 1 - Backend ✅
- [x] Setup SQLite + Prisma
- [x] API REST produits/commandes/catégories
- [x] Base de données avec schéma complet
- [x] **35 produits** et **9 articles blog** seedés

### Phase 2 - Checkout ✅
- [x] Page produit détaillée (/produit-detail-page/[id])
- [x] Flow panier → checkout existant
- [x] Gestion commandes API

### Phase 3 - Paiements ✅
- [x] Stripe intégration (checkout, payment intent)
- [x] Interface Mobile Money (MTN, Moov, Orange)
- [ ] Stripe Webhooks (Optionnel - configuration requise)

### Phase 4 - Admin & Auth ✅
- [x] Dashboard admin complet
- [x] Login/Register/Profile
- [x] Gestion produits, commandes, newsletter

### Phase 5 - PWA & SEO ✅
- [x] Configuration PWA
- [x] Images produits (35 SVG)
- [x] Sitemap et robots.txt

---

## 🚀 Projet Fonctionnel - Prochaines Étapes

### Configuration Requise (1 minute)
1. **Stripe** (obligatoire pour paiements)
   - Créer un compte sur [stripe.com](https://stripe.com)
   - Copier les clés dans `.env`:
     ```
     STRIPE_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     ```

### Optionnel - Améliorations futures
- Stripe Webhooks pour confirmation automatique
- Intégration API Mobile Money (MTN, Orange, Moov)
- Configuration SMTP pour emails

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