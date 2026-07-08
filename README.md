# Yomimasu

Japanese graded reader MVP — monorepo scaffold.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend + API:** Next.js (App Router) in `apps/web`
- **Shared types:** `packages/shared`
- **Database:** Drizzle ORM + PostgreSQL (Supabase) in `packages/db`
- **Planned:** Supabase Auth, Sudachi tokenizer, OpenAI sentence explain

## Project structure

```
yomimasu/
  apps/
    web/              Next.js app (UI + /api routes)
  packages/
    db/               Drizzle schema + DB client
    shared/           Shared TypeScript types
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

Seeds two free published texts:

- `/read/n5-morning-routine`
- `/read/n4-spring-picnic`

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

## Next steps

1. Reader page with clickable tokens + furigana
2. Admin panel for texts
3. Vocabulary save / progress tracking
