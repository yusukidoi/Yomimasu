# Yomimasu

Japanese graded reader MVP — monorepo scaffold.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend + API:** Next.js (App Router) in `apps/web`
- **Shared types:** `packages/shared`
- **Planned:** Supabase, Drizzle, Sudachi tokenizer

## Project structure

```
yomimasu/
  apps/
    web/              Next.js app (UI + /api routes)
  packages/
    shared/           Shared TypeScript types
```

## Requirements

- Node.js 20+
- pnpm 11+

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Health check API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |

## Next steps

1. Supabase + Drizzle database schema
2. Auth (email/magic link)
3. Reader page with tokenization
4. Admin panel for texts
