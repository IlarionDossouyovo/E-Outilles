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

## SEO & error pages (session 2026-10-05)
- `src/app/sitemap.ts` (dynamic, ~119 URLs) and `src/app/robots.ts` replace the
  old static `public/robots.txt` / `public/sitemap.xml` (deleted). `robots.ts`
  disallows `/admin`, `/profile`, `/cart`, `/wishlist`, `/checkout`, `/orders`,
  `/auth`.
- `src/app/opengraph-image.tsx` renders the branded 1200x630 OG image
  (`next/og`, `runtime = 'nodejs'`). Root `layout.tsx` sets `metadataBase` +
  Open Graph/Twitter defaults; per-page OG/canonical on category, blog and
  product pages.
- Client-component routes (`about`, `services`, `contact`, `formations`,
  `revendeurs`, `categories`, `search`, `telecharger`) cannot export `metadata`,
  so each has a tiny `layout.tsx` that exports it. `produit-detail-page/[id]`
  does the same to add per-product SEO without refactoring the client page.
- Global `src/app/not-found.tsx` (404) and `src/app/error.tsx` (client error
  boundary) render branded fallbacks with links back to home/categories/search.
- `SESSION_SECRET`: `src/lib/security/session.ts` warns (not throws) in
  production when it falls back to the dev default, so a missing secret never
  breaks `npm start`. `scripts/update.ps1` generates a 48-char secret into `.env`
  when the value is absent or still a `changez-…` placeholder.

## Cart / wishlist hydration (session 2026-10-05)
- `useCartStore` / `useWishlistStore` persist to localStorage. Their data exists
  only on the client, so rendering it during SSR (empty) then hydrating (filled)
  caused React hydration errors #418/#423/#425 on `/cart`, `/checkout`,
  `/wishlist`. Gate that markup with `useHydrated()` (`src/lib/useHydrated.ts`):
  render a stable empty shell server-side, show items only after mount.
  Any new component that reads a persisted store must do the same.
- Product `images` is a JSON array string. Normalize it with
  `parseImages()` / `firstImage()` from `src/lib/images.ts` when storing into the
  cart/wishlist (store `image` is a plain path, not the raw JSON) and when
  rendering. Never render `item.image` as text.
- Checkout has only two form steps (1 livraison, 2 paiement); step 3 is the
  confirmation screen. `handleSubmit` advances while `step < 2` — do not restore
  `< 3`, which made the final submit a no-op that never called `/api/orders`.
- Card payment is gated on `GET /api/payments/status` (`{ card: boolean }`),
  because `STRIPE_SECRET_KEY` is server-only. Without Stripe the option is
  disabled and labelled "Bientot disponible"; with Stripe the order is handed
  to Stripe Checkout (the webhook marks it paid). Never render a raw card
  number/expiry/CVC form — card data is collected only on Stripe's page.
- Mobile Money is an offline instruction rendered in the confirmation screen
  (order stays `pending`); no aggregator (FedaPay/CinetPay/PayDunya) is wired.

## Founder page (session 2026-10-05)
- `/fondateur` (server component, exports `metadata`) is the founder profile.
  Shared data lives in `src/lib/founder.ts` (`FOUNDER`), also consumed by the
  agent dashboard (`/agent`) so the identity stays single-sourced. Contact
  helpers: `founderMailto()`, `founderTel()`, `founderWhatsApp()`.
- Name fields: `fullName` = "DOSSOU-YOVO ATTIOGBE Yélian Auguste Ilarion"
  (legal, shown italic under the title), `name` = "Ilarion DOSSOU-YOVO ATTIOGBE"
  (display), `shortName` = "Ilarion Dossou-Yovo".
- Linked from the footer (Entreprise), the mobile nav, a teaser card on `/about`,
  and the sitemap.

## Admin area & agent dashboard access (session 2026-10-05)
- The admin pages are not "missing": `/admin`, `/admin/products`, `/admin/orders`,
  `/admin/add-product`, `/admin/settings`, `/admin/newsletter` all exist and are
  gated by `src/middleware.ts` (redirect to `/auth/login?redirect=…` when the
  session cookie is absent). Log in with the seeded admin account
  `admin@e-outilles.com / admin123`.
- Discovery gap fixed: `AuthButton` now shows an Admin link when
  `user.role === 'admin'`, and `/profile` shows "Tableau de bord admin" /
  "Agents IA" buttons for admins.
- `/agent` requires an extra shared code (`AGENT_ACCESS_CODE`, verified in
  `/api/agent/verify`), separate from the admin role. `scripts/update.ps1`
  generates it into `.env` when missing/placeholder and prints it at the end.
- DB seed (`prisma/seed.ts`) creates the admin + demo users; `dev.db` is
  gitignored and rebuilt by `npx prisma db seed`.
- Discoverability: footer has an "Administration" link; the login page shows
  admin credentials and a notice when redirected from a protected route.
- BUG FIXED: after login, `router.push(redirect)` raced the Server Action
  cookie commit, so middleware still saw an unauthenticated request and
  bounced back to `/auth/login?redirect=…` (only visible for middleware-
  protected targets like `/admin`; `/profile` worked because it is not gated).
  Login/register now use `window.location.assign(...)` for a full navigation.

## AI provider & email config (session 2026-10-05)
- `GOOGLE_AI_MODEL` default is `gemini-3.1-flash-lite`: the `-latest` aliases
  are frequently 503 and older pinned models (`gemini-2.5-flash`,
  `gemini-2.0-flash`) are retired (404). Candidate list retries on 404/429/503
  only; auth errors and timeouts fail fast, plus a 60s circuit breaker per
  provider in `generateText` so a dead provider never blocks a chat turn.
- Resend: `RESEND_API_KEY` works, but until the domain (`e-outilles.fr`) is
  verified at resend.com/domains, only sends to the Resend account address
  succeed; use `FROM_EMAIL=E-Outilles <onboarding@resend.dev>` meanwhile.
  Newsletter campaigns are real: `POST /api/newsletter/send` (admin-only)
  emails every active subscriber in batches of 5 via `sendEmail` and reports
  `{ sent, failed, total }`; the admin page shows that result inline.
- TTS (`/api/tts`): default `gemini-3.8-flash-tts` (returns playable WAV).
  The preview model (`gemini-2.5-flash-preview-tts`) needs an explicit
  "lis ce texte à voix haute" instruction and returns raw L16 PCM, which the
  browser `<audio>` element cannot play — the route now skips L16 so the
  client falls back to Web Speech. Client playback: `src/lib/ai/useVoice.ts`.
- Diagnostics: `GET /api/health` reports database status, product count and
  which integrations are configured (never the secret values).
- Assistant IA: full-page chat at `/chat` (agent selector, voice, quick
  prompts) plus the floating `ChatWidget`. The header nav now links to
  `/chat` as "Assistant IA" so visitors can find it.
- Admin: `/admin/customers` lists customers with order count and total spent
  (admin-only `GET /api/customers`, never returns password/reset tokens).
  Every admin page uses the shared `src/components/AdminNav.tsx` (Dashboard,
  Produits, Ajouter, Commandes, Clients, Newsletter, Parametres, Agents IA).
- Store settings: `/admin/settings` persists to the `Setting` table via
  `GET/PUT /api/admin/settings` (admin-only, 403 otherwise). The payload is
  whitelisted by `sanitizeSettings` in `src/lib/settings/store.ts` (unknown
  keys dropped). The page also shows live integration status (Google AI,
  Ollama, Resend, Stripe, webhook) and real analytics. `src/lib/settings/defaults.ts`
  is the client-safe shape/defaults (no Prisma import) — import defaults from
  there in client components to avoid bundling Prisma.
- Footer category links MUST use the real `Category.slug` values from the DB
  (`construction`, `power-tools`, `cordless-tools`, `hand-tools`, `automotive`,
  `garden`, ...), not French labels — mismatched slugs return 404.
- Agents IA (`/agent`): FOUNDER-ONLY. The registry is `src/lib/ai/agents.ts`
  (12 agents). Public chat exposes only `PUBLIC_AGENT_IDS`; internal agents
  (project, analytics, marketing, hr, finance, legal, sourcing) require the
  founder. `requireFounder()` / `isFounderEmail()` in
  `src/lib/security/founder.ts` (founder = `FOUNDER_EMAIL` env or
  `FOUNDER.email`). Middleware sends a non-founder signed-in user to
  `/profile?error=founder_only`. The optional `AGENT_ACCESS_CODE` is only a
  second factor.
- AI capabilities: agents declare `capabilities` (`text`/`vision`/`voice`/
  `reasoning`/`tools`). `GET /api/ai/agents` returns the agents allowed for the
  current visitor (public vs founder). Vision (`POST /api/chat` with `media[]`)
  is validated per agent via `agentSupportsVision`; only images/PDF up to 6 MB.
- Premium voice: `useVoice` supports one-shot dictation (`listen`), continuous
  handsfree mode (`startHandsFree`), server Gemini TTS with Web Speech
  fallback, and per-message replay. Vision attachments: `useAttachments`.
  Both `/chat` and the floating `ChatWidget` expose mic, camera and file input.
- Conversation persistence: `AiConversation` / `AiMessage` models. `POST
  /api/chat` stores both turns and returns a `conversationId`. Guests are
  tracked with an httpOnly `eo_guest` cookie (`src/lib/ai/conversations.ts`),
  signed-in users by `userId`; lookups are always owner-scoped (another
  visitor reading an id gets 404). `GET/DELETE /api/conversations` lists or
  clears the caller's history; `GET/DELETE /api/conversations/[id]` resumes or
  removes one. `/chat` restores the latest conversation on load and shows a
  history panel.
- Dashboards reachable from the footer bottom bar: Espace client, Espace
  vendeur, Agents IA, Administration.
- Redirects: `next/navigation` `redirect()` on a static page emits a client
  NEXT_REDIRECT payload (no HTTP 3xx/Location), so curl can't follow it — use
  the browser to verify. `/cgu` -> `/terms`, `/rgpd` -> `/privacy`,
  `/orders` -> `/profile`.
- Access control: a signed-in non-admin hitting an admin route is sent to
  `/profile?error=acces_refuse` (notice shown, param stripped). Post-login
  `?redirect=` goes through `safeRedirect()` in `src/lib/security/redirect.ts`
  (same-site absolute paths only; blocks `//evil.com` and `https://`).

