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

Open [http://localhost:3000](http://localhost:3000).

Health check API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

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

1. Supabase Auth wiring in `apps/web`
2. Apply migrations against a live Postgres
3. Reader page with tokenization
4. Admin panel for texts
