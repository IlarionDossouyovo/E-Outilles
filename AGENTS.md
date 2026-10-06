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
- `npm run lint` is interactive/slow in this environment; prefer `npm run build` for type checks.

## Conventions & gotchas
- `middleware.ts` must live in `src/` for it to run (project root is `src/`).
- Server-side auth helpers live in `src/lib/security/auth.ts` (`getSession`, `requireAdmin`).
- Admin-only API routes must call `requireAdmin()`; the middleware only guards pages.
- Payment/Stripe config detection: `src/lib/payments/config.ts` (`isStripeConfigured`).
- Product images are SVGs under `public/products/` and `public/blog/`.
- `prisma/dev.db` is tracked but should not be committed with local test data churn.
- Demo accounts: `admin@e-outilles.com / admin123`, `demo@e-outilles.com / demo123`.
