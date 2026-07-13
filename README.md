# Yomimasu

Japanese graded reader MVP — monorepo scaffold.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend + API:** Next.js (App Router) in `apps/web`
- **Shared types:** `packages/shared`
- **Database:** Drizzle ORM + PostgreSQL (Supabase) in `packages/db`
- **Japanese NLP:** Kuromoji in `packages/japanese` (Milestone 1)
- **Auth:** Supabase Auth
- **Planned:** JMdict meanings, admin token correction, OpenAI sentence explain (cached)

## Project structure

```
yomimasu/
  apps/
    web/              Next.js app (UI + /api routes)
  packages/
    db/               Drizzle schema + DB client + process/store
    japanese/         Kuromoji tokenizer
    shared/           Shared TypeScript types
  docs/
    milestone-1-technical-note.md
```

## Requirements

- Node.js 20+
- pnpm 11+
- PostgreSQL / Supabase (needed for migrations; optional for UI-only work)

## Setup

```bash
pnpm install
cp packages/db/.env.example packages/db/.env
cp apps/web/.env.example apps/web/.env.local
```

Fill `DATABASE_URL` (and later Supabase keys) in those env files.

## Development

```bash
pnpm dev
```

## Authentication

Email/password auth is handled by Supabase.

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Sign up with an email + password
3. For local MVP, disable email confirmation in Supabase:
   - Authentication → Providers → Email → turn off **Confirm email**

Protected routes: `/app`, `/admin`

## Seed sample texts

```bash
pnpm db:seed
```

Seeds two free published texts with token data.

## Admin access

1. Sign up once in the app (creates a `profiles` row).
2. Grant admin:

```bash
pnpm admin:grant your@email.com
```

3. Open [http://localhost:3000/admin](http://localhost:3000/admin)

## Database

```bash
pnpm db:generate   # generate SQL from schema
pnpm db:migrate    # apply migrations
pnpm db:push       # push schema (local iteration)
pnpm db:studio     # Drizzle Studio
```

See `packages/db/README.md` for table overview.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:*` | Database generate / migrate / push / studio |

## Japanese processing

```bash
# Tokenize only (no DB)
pnpm --filter @yomimasu/japanese tokenize:demo

# Process + store tokens in Supabase/Postgres
pnpm db:process -- --all-samples
pnpm db:process -- --slug live-demo --body "昨日の夜、図書館で日本語の本を読みました。"
```

Kuromoji tokenizer: `packages/japanese`  
DB persistence: `packages/db` → `processAndStoreTextTokens` / `upsertAndProcessText`  
Admin UI: `/admin` → paste Japanese → tokenize into Postgres → open `/read/[slug]`

**Vercel / staging:** `pnpm install` runs `postinstall`, which copies Kuromoji dict files into `packages/japanese/vendor/dict`. Next.js includes them in the serverless bundle via `outputFileTracingIncludes`. If tokenization fails on deploy, redeploy after a fresh install (not just cache reuse).

Milestone 1 acceptance note: [`docs/milestone-1-technical-note.md`](docs/milestone-1-technical-note.md)

## Next steps

1. Deploy staging (Vercel) + push to client GitHub for M1 acceptance
2. JMdict meanings + richer admin tokenize/publish flow
3. Wire landing/dashboard charts to `reading_sessions` + `user_vocabulary`
4. Admin token correction UI + AI sentence explain (cached)
