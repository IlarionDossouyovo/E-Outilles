# Deployment & integration tokens

This document lists where to create the API keys / tokens the app reads, and how
each service is wired. Values are read from environment variables only — never
commit real secrets.

## Where to get the tokens

| Service | Purpose | Token / keys page |
| --- | --- | --- |
| Neon.tech | Managed Postgres (production DB) | API keys: https://console.neon.tech/app/settings/api-keys — connection string: project → **Connection Details** |
| Vercel | Optional front-end host | Account token: https://vercel.com/account/tokens |
| Render | Current production host | API key: https://dashboard.render.com/u/settings#api-keys |
| Brevo | Transactional email (SMTP relay) | API + SMTP keys: https://app.brevo.com/settings/keys/api |
| Google AI (Gemini) | Chat + TTS | API key: https://aistudio.google.com/apikey |
| Resend | Transactional email (primary) | API key: https://resend.com/api-keys |
| Stripe | Card payments | API keys: https://dashboard.stripe.com/apikeys — webhook secret: https://dashboard.stripe.com/webhooks |

> Neon is Postgres: copy **both** the pooled URL (host contains `-pooler`) and
> the direct URL (no `-pooler`). Migrations must use the direct URL.

## Environment variables

Required in production (Render → Environment, or Vercel → Settings → Env Vars):

```
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=require   # pooled, runtime
DIRECT_URL=postgresql://.../neondb?sslmode=require               # direct, migrations
SESSION_SECRET=<48 random chars>
GOOGLE_AI_API_KEY=<AQ.… or AIza…>
GOOGLE_AI_MODEL=gemini-3.5-flash
GOOGLE_AI_TTS_MODEL=gemini-3.8-flash-tts
GOOGLE_AI_TTS_VOICE=Kore
RESEND_API_KEY=<resend key>
FROM_EMAIL=E-Outilles <onboarding@resend.dev>   # until the domain is verified
BREVO_API_KEY=<brevo key>                        # optional SMTP fallback
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=<brevo login>
SMTP_PASSWORD=<brevo smtp key>
FOUNDER_EMAIL=<founder account email>
AGENT_ACCESS_CODE=<shared code for /agent>
NODE_VERSION=20
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
are optional: without them card payment is disabled at checkout and the app falls
back to cash on delivery / Mobile Money. `GET /api/health` and
`GET /api/admin/settings` report which integrations are configured (never the
secret values).

## Neon pooler and migrations

The Neon **pooled** endpoint (PgBouncer) does not support the advisory lock
Prisma uses for migrations, which fails with `P1002`. `prisma/schema.prisma`
therefore declares both `url = env("DATABASE_URL")` (pooled, runtime) and
`directUrl = env("DIRECT_URL")` (direct, migrations). Always run migrations with:

```
npm run migrate:deploy   # scripts/migrate-deploy.mjs — warms Neon then retries
```

## Render (current production)

- Service: `srv-dbq7ppl9fdbs73dkkmg0`, live at https://e-outilles.onrender.com
- Build: `npm install && npm run build`; Start: `npm start` (port 3003)
- Trigger a deploy from the CLI/API:

```
curl -X POST "https://api.render.com/v1/services/$SVC/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" -H 'Content-Type: application/json' \
  -d '{"clearCache":"do_not_clear"}'
```

## Vercel (optional)

No Vercel project/token is configured yet. To deploy:

1. Create a token at https://vercel.com/account/tokens and set `VERCEL_TOKEN`.
2. `npm i -g vercel && vercel link && vercel --prod`.
3. Add every variable above under **Settings → Environment Variables**.
4. If the preview is protected, generate a **Protection Bypass for Automation**
   secret (Settings → Deployment Protection) so automated checks can reach it.
