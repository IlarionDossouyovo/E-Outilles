# Déploiement E-Outilles — Neon, Vercel, Render, Brevo

Ce guide liste les services à connecter, les liens exacts pour créer les
comptes, et **quelle variable d'environnement** chaque service fournit.
Les clés et tokens ne peuvent pas être créés à ta place : ils dépendent de tes
comptes. Une fois que tu les as, colle-les dans Vercel (ou dans `.env` en local)
et tout se branche automatiquement — l'application les détecte au démarrage.

---

## 0. Liens directs pour créer les comptes et copier les tokens / APIs

| Service | Créer le compte | Récupérer la clé / le token | Variable à coller |
|---|---|---|---|
| **Neon.tech** (base PostgreSQL) | https://console.neon.tech/signup | Console → projet → **Connect** (Connection string) | `DATABASE_URL` |
| **Vercel** (hébergement) | https://vercel.com/signup | https://vercel.com/dashboard → projet → **Settings → Environment Variables** | toutes les variables |
| **Vercel** (bypass tests auto) | — | Settings → **Deployment Protection** → Protection Bypass for Automation | secret `x-vercel-protection-bypass` |
| **Render** (hébergement alt.) | https://dashboard.render.com/register | Service → **Environment → Add Environment Variable** | toutes les variables |
| **Brevo** (email) | https://app.brevo.com/account/register | https://app.brevo.com/settings/keys/api | `BREVO_API_KEY` |
| **Brevo** (expéditeurs vérifiés) | — | https://app.brevo.com/senders/list | `FROM_EMAIL` |
| **Brevo** (SMTP) | — | https://app.brevo.com/settings/keys/smtp | `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` |
| **Resend** (email, déjà utilisé) | https://resend.com/signup | https://resend.com/api-keys | `RESEND_API_KEY` |
| **Resend** (domaine) | — | https://resend.com/domains | `FROM_EMAIL` |
| **Stripe** (paiement carte) | https://dashboard.stripe.com/register | https://dashboard.stripe.com/apikeys | `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Stripe** (webhook) | — | https://dashboard.stripe.com/webhooks | `STRIPE_WEBHOOK_SECRET` |
| **Google AI / Gemini** (IA + voix) | https://aistudio.google.com/app/apikey | même page → **Create API key** | `GOOGLE_AI_API_KEY` |
| **Ollama** (IA locale, optionnel) | https://ollama.com/download | — | `OLLAMA_API_URL` |

> Ces comptes et clés dépendent de tes identifiants : je ne peux pas les créer
> à ta place. Dès que les clés sont dans Vercel (ou `.env`), l'application les
> détecte automatiquement ; si une clé manque, elle continue en mode démo.

---

## 1. Base de données — Neon.tech (PostgreSQL serverless)

- Inscription / console : https://console.neon.tech/signup
- Créer un projet → **Connection string** (onglet *Dashboard* → *Connect*).

À récupérer :

| Variable | Où la trouver |
|---|---|
| `DATABASE_URL` | Chaîne `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require` |

À faire côté code (une seule fois) : le projet est configuré en SQLite
(`prisma/schema.prisma`, `provider = "sqlite"`). Pour Neon, il faut passer en
PostgreSQL :

```prisma
datasource db {
  provider = "postgresql"   // était "sqlite"
  url      = env("DATABASE_URL")
}
```

Puis :

```bash
npx prisma migrate deploy   # applique les migrations sur Neon
npx prisma db seed          # remplit les données de démonstration (idempotent)
```

> En local, garde `DATABASE_URL="file:./dev.db"` et le provider SQLite si tu
> veux continuer à développer sans Postgres. Le plus simple : une branche de
> schéma par environnement.

---

## 2. Hébergement applicatif — Vercel (recommandé) ou Render

### Vercel (Next.js natif)
- Inscription : https://vercel.com/signup
- Importer le dépôt : https://vercel.com/new
- **Settings → Environment Variables** : ajouter toutes les variables ci-dessous.
- Protection d'accès pour les tests automatisés :
  https://vercel.com/docs/security/deployment-protection#protection-bypass-for-automation
  (génère un secret `x-vercel-protection-bypass`).

### Render (alternative)
- Inscription : https://dashboard.render.com/register
- **New → Web Service** → connecter le dépôt Git.
- Build : `npm install && npx prisma generate && npm run build`
- Start : `npm start`
- **Environment → Add Environment Variable** pour chaque clé.

---

## 3. Email transactionnel — Brevo (ex-SendGrid FR)

- Inscription : https://app.brevo.com/account/register
- Clé API : https://app.brevo.com/settings/keys/api → **Generate a new API key**.
- Expéditeurs vérifiés : https://app.brevo.com/senders/list
  (vérifier le domaine `e-outilles.fr` via DNS : SPF, DKIM, DMARC).

À récupérer :

| Variable | Valeur |
|---|---|
| `BREVO_API_KEY` | `xkeysib-...` |
| `FROM_EMAIL` | `E-Outilles <noreply@e-outilles.fr>` (domaine vérifié) |
| `SMTP_HOST` / `SMTP_PORT` | `smtp-relay.brevo.com` / `587` (si tu utilises SMTP) |
| `SMTP_USER` / `SMTP_PASSWORD` | login SMTP Brevo / clé SMTP |

> Le projet envoie aujourd'hui via **Resend** (`RESEND_API_KEY`). Brevo
> s'utilise soit en SMTP, soit via l'API. Pour brancher l'API Brevo, il suffit
> d'ajouter `BREVO_API_KEY` : `src/lib/email/` choisira le transport disponible
> (Resend → Brevo → log console).

---

## 4. Récapitulatif des variables d'environnement

```dotenv
# --- Base de données ---
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"

# --- Application ---
NEXT_PUBLIC_APP_URL="https://e-outilles.fr"
NEXT_PUBLIC_BASE_URL="https://e-outilles.fr"
SESSION_SECRET="<48 caractères aléatoires>"

# --- Paiements Stripe ---
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# --- IA (Gemini) + voix ---
GOOGLE_AI_API_KEY="AIza... ou AQ...."
GOOGLE_AI_MODEL="gemini-3.1-flash-lite"
GOOGLE_AI_TTS_MODEL="gemini-3.8-flash-tts"
GOOGLE_AI_TTS_VOICE="Kore"

# --- Email (Resend et/ou Brevo) ---
RESEND_API_KEY="re_..."
BREVO_API_KEY="xkeysib-..."
FROM_EMAIL="E-Outilles <noreply@e-outilles.fr>"

# --- Accès fondateur ---
FOUNDER_EMAIL="ilarion@e-outilles.com"
AGENT_ACCESS_CODE="<code secret>"

# --- Optionnel ---
OLLAMA_API_URL="http://localhost:11434"
OLLAMA_CHAT_MODEL="llama3.2:latest"
```

---

## 5. Vérification après déploiement

- `GET /api/health` → `{ status, database, productCount, ai, email, stripe }`
  (n'expose jamais les secrets).
- `GET /api/geo` → détection pays → langue automatique.
- `GET /api/ai/agents` → agents disponibles selon le visiteur.
- `/chat` → voix, dictée, analyse photo.

> Toutes les intégrations sont **optionnelles** : si une clé manque,
> l'application continue de fonctionner (mode démo) au lieu de planter.
