# Finalisation E-Outilles - État et déploiement

Ce document récapitule ce qui a été finalisé, la configuration requise et les
commandes pour répliquer le projet en local et le mettre en production.

## 1. Ce qui est terminé

### Build & types
- Correction de l'itération `Uint8Array` (cible es5) dans `src/lib/security/session.ts`.
- `AuthButton.tsx` utilise le type `SessionUser` partagé.
- `npm run build` : OK.

### Sécurité / RBAC
- `middleware.ts` déplacé dans `src/` (sinon jamais exécuté avec un projet en `src/`).
- `/admin` et `/agent` : admins uniquement. `/vendeur` : tout utilisateur connecté.
- `POST /api/products`, `PATCH /api/orders/[id]`, `GET /api/newsletter` : admins uniquement.
- Tableau de bord `/agent` : accès vérifié côté serveur via `AGENT_ACCESS_CODE` (plus de code en dur).

### Paiements Stripe
- `POST /api/payments/stripe/create-checkout-session` construit la session depuis
  la commande réelle (`orderId`) et met `metadata.orderId`.
- Webhook `checkout.session.completed` → commande passée à `paid`.
- `payment_intent.succeeded` → réconciliation par `paymentId`.
- `checkout.session.expired` → commande `pending` annulée.
- Page `/success` ajoutée.
- Si Stripe n'est pas configuré : repli hors-ligne (commande `pending`, pas de paiement en ligne).

### Données réelles (plus de mocks)
- Dashboard admin, commandes, newsletter, ajout produit, page vendeur, tableau agents.
- Formulaires revendeur et newsletter branchés sur l'API.

### Intelligence Artificielle (Google AI / Gemini)
- Couche fournisseur unifiée `src/lib/ai/provider.ts` : Google AI (Gemini) prioritaire,
  puis Ollama, puis mode démo. Détection automatique des clés placeholder.
- Registre d'agents `src/lib/ai/agents.ts` : 10 agents (assistant, vendeur, support,
  suivi, projet, analyste, marketing, RH, finance, légal) avec prompts spécialisés.
- Raisonnement en deux passes `src/lib/ai/reasoning.ts` : analyse de l'intention puis
  réponse finale, avec lecture du catalogue réel (prix exacts) pour les agents concernés.
- `/api/chat` : accepte `agentId`, `history` et `reasoning` ; routage automatique vers
  l'agent pertinent ; réponse toujours garantie (démo hors-ligne).

### Synthèse vocale (TTS)
- `POST /api/tts` : synthèse vocale via Gemini TTS (voix `Kore` par défaut).
- Hook `src/lib/ai/useVoice.ts` : lecture TTS serveur puis repli Web Speech API,
  plus la dictée (reconnaissance vocale) en français.
- Intégrés au widget de chat et à la page `/chat` (boutons 🔊 / 🎤).

### Application téléchargeable + QR code (PWA)
- Page `/telecharger` : QR code, bouton d'installation PWA, instructions Android/iOS/desktop.
- `GET /api/qrcode` : génère un QR code PNG (pointe vers l'URL du site).
- `ServiceWorkerRegister` enregistre `/sw.js` (le service worker existant n'était pas activé).
- Lien « 📲 Télécharger l'app » et QR code ajoutés au pied de page d'accueil.

### Catégories responsives + animations premium
- Page `/categories` désormais alimentée par `/api/categories` (données réelles,
  comptage produits, produits en vedette par catégorie).
- Grille responsive 2 / 3 / 4 colonnes, onglets scrollables sur mobile.
- Animations premium (`globals.css`) : `card-premium`, shimmer, fade-in-up, pop-in,
  entrées décalées, avec respect de `prefers-reduced-motion`.

### Authentification — mot de passe oublié
- `POST /api/auth/forgot-password` : génère un jeton (hash SHA-256, expiration 1h) et
  envoie un email de réinitialisation.
- `POST /api/auth/reset-password` + page `/auth/reset-password` : définition du nouveau mot de passe.
- Champs `resetTokenHash` / `resetTokenExpiry` ajoutés au modèle `User`.

### Médias
- Références d'images produits/blog corrigées (`.jpg` → `.svg`), visuels SVG générés.

## 2. Variables d'environnement

Copier `.env.example` vers `.env` et renseigner :

| Variable | Obligatoire | Rôle |
|---|---|---|
| `DATABASE_URL` | oui | SQLite `file:./dev.db` (défaut) ou PostgreSQL |
| `NEXT_PUBLIC_BASE_URL` / `NEXT_PUBLIC_APP_URL` | oui | URL publique (redirections Stripe) |
| `SESSION_SECRET` | oui | Signature des cookies de session |
| `STRIPE_SECRET_KEY` | pour paiement en ligne | Clé secrète Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pour paiement en ligne | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | pour webhook | Secret de signature du webhook |
| `RESEND_API_KEY` | pour emails | Envoi des emails transactionnels |
| `FROM_EMAIL` | recommandé | Expéditeur des emails |
| `GOOGLE_AI_API_KEY` | recommandé | Clé Google AI Studio (Gemini) pour les agents IA |
| `GOOGLE_AI_MODEL` | optionnel | Modèle Gemini (défaut `gemini-flash-lite-latest`) |
| `GOOGLE_AI_TTS_MODEL` / `GOOGLE_AI_TTS_VOICE` | optionnel | Synthèse vocale (défaut `gemini-3.8-flash-tts`, voix `Kore`) |
| `OLLAMA_API_URL` / `OLLAMA_CHAT_MODEL` | optionnel | Repli IA local (mode démo sinon) |
| `AGENT_ACCESS_CODE` | recommandé | Accès au tableau de bord agents |

Les clés `sk_test_votre_cle_secrete` / `whsec_votre_secret_webhook` sont des
placeholders : l'application les détecte et reste en mode hors-ligne.

## 3. Mise à jour locale (Windows / PowerShell)

```powershell
cd C:\E-Outilles
powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
```

Ou manuellement :

```powershell
git fetch origin
git checkout fix/finalisation-build-admin-auth
git pull origin fix/finalisation-build-admin-auth
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed   # seulement si prisma\dev.db n'existe pas
npm run build
npm run dev          # http://localhost:3003
```

## 4. Configuration du webhook Stripe

En développement :

```powershell
stripe listen --forward-to localhost:3003/api/webhooks/stripe
# Copier le whsec_... affiché dans STRIPE_WEBHOOK_SECRET (.env), puis redémarrer
```

En production : créer un endpoint `https://VOTRE-DOMAINE/api/webhooks/stripe`
pour l'événement `checkout.session.completed` (et `checkout.session.expired`).

## 5. Déploiement

1. Renseigner toutes les variables d'environnement sur l'hébergeur (Vercel, VPS…).
2. Migrer la base : `npx prisma migrate deploy`.
3. `npm run build` puis `npm start` (ou déploiement Vercel).
4. Configurer le webhook Stripe vers l'URL de production.

## 6. Points d'attention restants

- Le paiement « Mobile Money » est une simulation d'interface : il crée la
  commande mais n'appelle aucun opérateur réel (MTN/Moov/Orange).
- La note/avis vendeur (`averageRating`) est fixe (4.8) faute de données d'avis en base.
