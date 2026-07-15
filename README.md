# Yomimasu

Japanese graded reader MVP — monorepo.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend + API:** Next.js (App Router) in `apps/web`
- **Shared types:** `packages/shared`
- **Database:** Drizzle ORM + PostgreSQL (Supabase) in `packages/db`
- **Japanese NLP:** Kuromoji in `packages/japanese`
- **Auth:** Supabase Auth (profiles with `free` / `premium` + `isAdmin`)
- **AI:** OpenAI sentence explain only (cached in `ai_explanations`, usage in `ai_usage_events`)

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
    staging-handover.md
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

Fill `DATABASE_URL`, Supabase keys, and optionally `OPENAI_API_KEY` in those env files.
Then apply schema:

```bash
pnpm db:push
# or pnpm db:migrate after pnpm db:generate
```

## Development

```bash
pnpm dev
```

## Authentication & roles

Email/password auth is handled by Supabase.

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Sign up with an email + password
3. For local MVP, disable email confirmation in Supabase:
   - Authentication → Providers → Email → turn off **Confirm email**

Protected routes: `/app`, `/admin`

```bash
pnpm admin:grant your@email.com
pnpm role:set your@email.com premium   # or free
```

- **Admin** (`is_admin`): content + token tools
- **Free / premium** (`account_role`): library access to non-free texts

## Seed sample texts

```bash
pnpm db:seed
pnpm db:seed-dictionary
```

## Admin content

1. Open [http://localhost:3000/admin](http://localhost:3000/admin)
2. Paste Japanese → tokenize as draft or published (topic, free flag, header image URL)
3. Publish / unpublish / archive from the table
4. Correct tokens → `Reader` or `Preview`

## Library & reader

- Published texts: `/library`
- Reader: `/read/[slug]` (drafts need admin `?preview=1`)
- Word popups use stored token data (never AI)
- Sentence **Explain** uses OpenAI when keyed, otherwise demo + DB cache

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
| `pnpm admin:grant` | Grant admin on a profile email |
| `pnpm role:set` | Set free/premium on a profile email |

## Japanese processing

```bash
pnpm --filter @yomimasu/japanese tokenize:demo
pnpm db:process -- --all-samples
pnpm db:process -- --slug live-demo --body "昨日の夜、図書館で日本語の本を読みました。"
```

**Vercel / staging:** `pnpm install` runs `postinstall`, which copies Kuromoji dict files into `packages/japanese/vendor/dict`. Next.js includes them in the serverless bundle via `outputFileTracingIncludes`.

Milestone 1 note: [`docs/milestone-1-technical-note.md`](docs/milestone-1-technical-note.md)  
Staging handover: [`docs/staging-handover.md`](docs/staging-handover.md)

## Milestone status

- **M1** technical criteria: implemented locally; formal acceptance needs staging URL + client GitHub access
- **M2** working MVP gaps closed in this codebase path: roles, library gating, admin publish UI, AI context/usage, live dashboard counts
