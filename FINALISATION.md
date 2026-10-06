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
| `OLLAMA_API_URL` / `OLLAMA_CHAT_MODEL` | optionnel | Chatbot IA (mode démo sinon) |
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
