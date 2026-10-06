# AGENTS.md

Persistent notes for working on the E-Outilles codebase.

## Stack
- Next.js 14 App Router + TypeScript + Tailwind, project uses the `src/` directory.
- SQLite via Prisma (`prisma/dev.db`), Stripe, Resend, Ollama chatbot.
- Dev/start port is **3003** (`next dev --port 3003`).

## Commands
- Build: `npm run build` — must pass before any commit.
- Dev server: `npm run dev` (port 3003).
- Prisma: `npx prisma generate`, `npx prisma migrate deploy`, `npx prisma db seed`.
- Lint: `.eslintrc.json` extends `next/core-web-vitals` and disables
  `react/no-unescaped-entities` (French copy uses raw `'`/`"`). `npm run lint`
  now exits cleanly; run `npx next lint --dir src` to check.

## Conventions & gotchas
- `middleware.ts` must live in `src/` for it to run (project root is `src/`).
- Server-side auth helpers live in `src/lib/security/auth.ts` (`getSession`, `requireAdmin`).
- Admin-only API routes must call `requireAdmin()`; the middleware only guards pages.
- Payment/Stripe config detection: `src/lib/payments/config.ts` (`isStripeConfigured`).
- Product images are SVGs under `public/products/` and `public/blog/`.
- `prisma/dev.db` is tracked but should not be committed with local test data churn.
- Demo accounts: `admin@e-outilles.com / admin123`, `demo@e-outilles.com / demo123`.

## AI / PWA (session 2026-10-05)
- AI provider: `src/lib/ai/provider.ts` — Google AI (Gemini) -> Ollama -> demo.
  Google keys can start with `AIza` OR `AQ.`; auth via `x-goog-api-key` header.
  Chat model fallback chain: gemini-flash-lite-latest, gemini-flash-latest, gemini-3.8-flash, gemini-3.1-flash-lite.
  TTS: `/api/tts` (gemini-3.8-flash-tts / 2.5-preview-tts, voice Kore) -> Web Speech fallback.
- Agents registry: `src/lib/ai/agents.ts` (10 agents). Reasoning: `src/lib/ai/reasoning.ts` (2 passes + catalog).
- Voice hook: `src/lib/ai/useVoice.ts` (TTS + dictation).
- PWA: `/telecharger` page + `GET /api/qrcode` (PNG) + `ServiceWorkerRegister` registering `/sw.js`.
- `prisma/dev.db` is gitignored; local SQLite only.

## UI chrome & animations (session 2026-10-05)
- `src/components/Header.tsx` is the single main navigation (search, cart/wishlist
  counters, `AuthButton`, Commander CTA, animated underline, mobile panel).
  `src/components/Footer.tsx` is the shared footer.
- `src/components/SiteChrome.tsx` (rendered in `src/app/layout.tsx`) injects
  Header/Footer on public routes and a `page-enter` transition keyed on
  `pathname`. Routes under `/admin`, `/agent`, `/vendeur`, `/auth` keep their own
  chrome (listed in `BARE_PREFIXES`).
- Do NOT add a per-page `<nav>`/`<footer>`: public pages rely on `layout.tsx`.
  Dashboards are the only place that should render their own chrome.
- Scroll animations: wrap sections in `<Reveal>` (`src/components/Reveal.tsx`,
  `.reveal`/`.is-visible` in `globals.css`). Entrance utilities: `animate-fade-in-up`,
  `animate-fade-in`, `animate-pop-in` + `stagger-1..6`. Card hover: `card-premium`.
- Respect `prefers-reduced-motion` (handled globally in `globals.css`).
- If dynamic routes 500 with `Cannot find module './vendor-chunks/...'`, the
  `.next` cache is stale (dev server ran during a `next build`). Stop dev,
  `rm -rf .next`, restart `npm run dev`.

## Database resilience at build (session 2026-10-05)
- `/categories/[slug]` is gated by the static catalog (`src/lib/catalog.ts`),
  NOT by the DB. `generateStaticParams` enumerates `CATEGORY_META` and the page
  only calls `notFound()` when the slug is absent from the catalog. All Prisma
  reads are wrapped in try/catch and fall back to catalog values, so a build with
  an empty/unmigrated `dev.db` no longer prerenders 18 pages as 404.
- Keep it that way: never let a Prisma read decide whether a statically listed
  page exists. The DB enriches (products, counts, related posts); the catalog decides.
- Catalog slug `jardinage` maps to DB slug `garden` via `DB_SLUG_ALIASES`
  (`dbSlugFor`). Add an alias if a catalog slug has no matching seed row.
- `prisma/dev.db` is gitignored and absent from fresh clones. Migrations create
  the tables; `npx prisma db seed` (upserts, idempotent) fills demo data.
  A `dev.db` that exists but was never seeded causes
  `P2021: The table 'main.Category' does not exist` during `next build`.
- `scripts/update.ps1` always runs `prisma db seed` (no longer skipped when
  `dev.db` exists) to avoid the empty-DB build failure on the local machine.
