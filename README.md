# E-Outilles

Boutique e-commerce d'outillage professionnel **INGCO** pour l'Afrique de l'Ouest.

## Stack

- **Next.js 14** (App Router, dossier `src/`) + TypeScript + Tailwind CSS
- **Prisma** + SQLite (`prisma/dev.db`)
- **Stripe** (paiements), **Resend** (emails transactionnels)
- **Chatbot IA** : Google AI (Gemini) → Ollama → mode démo
- **PWA** : installable, page `/telecharger` + QR code (`/api/qrcode`)

## Démarrage rapide

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed      # données de démonstration (upsert, réexécutable)
npm run dev             # http://localhost:3003
```

### Démarrage automatique (Windows)

Le script `scripts/start.ps1` fait tout en une commande : dépendances, `.env`,
Prisma (generate + migrate + seed), Ollama, puis lance le serveur sur le port
3003 et ouvre le navigateur.

> Si vous êtes **déjà dans PowerShell** (invite `PS C:\E-Outilles>`), lancez le
> script directement — ne tapez pas `powershell` devant :

```powershell
# Développement
.\scripts\start.ps1

# Production (build + npm start)
.\scripts\start.ps1 -Prod
```

Si le script est bloqué par la politique d'exécution, autorisez-le pour la
session en cours :

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\start.ps1
```

Depuis **cmd.exe** (ou si `powershell` n'est pas dans le PATH), utilisez :

```cmd
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

Ou double-cliquez sur `demarrer.bat` à la racine du projet.

Si le disque est plein (`ENOSPC: no space left on device`), libérez de l'espace
puis relancez avec `-Clean` (vide `.next` et les caches npm) :

```powershell
.\scripts\start.ps1 -Clean
```

> Les catégories de la page `/categories/[slug]` s'appuient sur le catalogue
> statique (`src/lib/catalog.ts`) et se construisent même si la base est vide.
> Le seed reste nécessaire pour afficher les produits, articles et comptes de démo.

### Base vide ou build qui échoue

Si `npm run build` affiche `The table 'main.Category' does not exist`, la base
SQLite existe mais n'a jamais été migrée/seedée. Corrigez avec :

```bash
npx prisma migrate deploy
npx prisma db seed
npm run build
```

Si `npm start` échoue avec `ENOENT ... prerender-manifest.json`, le build a
échoué plus haut : relancez `npm run build` et vérifiez qu'il se termine sans
`Export encountered errors`.

## Variables d'environnement (`.env`)

Copier `.env.example` vers `.env`, puis renseigner :

| Clé | Rôle | Obligatoire |
|---|---|---|
| `DATABASE_URL` | SQLite (`file:./dev.db`) | oui |
| `SESSION_SECRET` | signature des cookies de session | oui en production |
| `GOOGLE_AI_API_KEY` | chatbot IA (Gemini) | recommandé |
| `GOOGLE_AI_MODEL` | modèle chat (`gemini-flash-lite-latest`) | non |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | paiements | oui |
| `STRIPE_WEBHOOK_SECRET` | confirmation des paiements | oui |
| `RESEND_API_KEY` + `FROM_EMAIL` | emails transactionnels | recommandé |
| `AGENT_ACCESS_CODE` | accès tableau de bord agents IA | non |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_BASE_URL` | URL publique | oui |

Sans `GOOGLE_AI_API_KEY`, le chatbot bascule sur Ollama puis sur un mode démo.

## Scripts npm

| Commande | Description |
|---|---|
| `npm run dev` | serveur de développement (port **3003**) |
| `npm run build` | build de production |
| `npm run start` | serveur de production (port 3003) |
| `npm run lint` | ESLint (`next/core-web-vitals`) |

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@e-outilles.com` | `admin123` |
| Client | `demo@e-outilles.com` | `demo123` |

## Paiements (local)

```bash
stripe listen --forward-to localhost:3003/api/webhooks/stripe
```

## Mise à jour locale (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update.ps1
```

## Conventions

- `middleware.ts` doit rester dans `src/` pour s'exécuter.
- Icônes UI : composant `@/components/Icons` (`<Icon name="…" />`), pas d'emoji dans les pages.
- Les routes API sensibles appellent `requireAdmin()` (`src/lib/security/auth.ts`).
- SEO : `sitemap.ts`/`robots.ts` dynamiques ; pour une page `'use client'`, les
  métadonnées vont dans un `layout.tsx` voisin (une page client ne peut pas
  exporter `metadata`).
- Pages de secours globales : `src/app/not-found.tsx` (404) et
  `src/app/error.tsx` (erreur runtime).
