# Staging & GitHub handover

Use this checklist to finish Milestone 1/2 acceptance with the client.

## 1. Push code

```bash
git push -u origin HEAD
```

If the client provided a different GitHub remote, add it and push there:

```bash
git remote add client https://github.com/CLIENT_ORG/REPO.git
git push -u client main
```

## 2. Supabase (shared with local)

Ensure production/preview env uses the same project (or a dedicated staging project):

- Session / transaction **pooler** `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or publishable key)
- Optional: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`

Apply schema on that database:

```bash
pnpm db:push
# or migrate if you prefer generated SQL
```

## 3. Vercel staging

1. Import the GitHub repo in Vercel (root of monorepo).
2. Set **Root Directory** to `apps/web` **or** leave monorepo root and set build:
   - Install: `pnpm install`
   - Build: `pnpm --filter @yomimasu/web build`
   - Output: Next.js default for `apps/web`
3. Add environment variables (Production + Preview) from `apps/web/.env.example`.
4. Deploy → copy the Preview/Production URL.

Tokenizer note: first deploy after install must include Kuromoji `vendor/dict` (postinstall). Prefer a clean install, not a stale cache, if tokenize fails on Vercel.

## 4. Seed + test accounts

```bash
pnpm db:seed
pnpm db:seed-dictionary
pnpm admin:grant client@example.com
pnpm role:set client-premium@example.com premium
```

Hand the client:

- Staging URL
- Free test login
- Premium test login (optional)
- Admin login (or grant after they sign up)

## 5. Acceptance smoke test

1. Open free text from `/library` → furigana + word popup (no AI)
2. Save a word → appears on `/app`
3. Admin: create draft → public reader 404 → publish → visible
4. Free user cannot open a non-free text; premium/admin can
5. Explain sentence → cached on second click; AI count bumps on `/app`

## Staging URL

https://yomimasu-web.vercel.app/
