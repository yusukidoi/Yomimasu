# Database package — Drizzle ORM schema and client for Yomimasu.

## Setup

1. Copy env file:

```bash
cp packages/db/.env.example packages/db/.env
```

2. Set `DATABASE_URL` to your Supabase Postgres connection string.

3. From the repo root:

```bash
pnpm db:generate   # write SQL migrations from schema
pnpm db:migrate    # apply migrations
# or for early local iteration:
pnpm db:push       # push schema without migration files
```

## Tables (MVP)

| Table | Purpose |
|-------|---------|
| `profiles` | User profile (id matches Supabase Auth user) |
| `texts` | Graded reading texts |
| `text_sentences` | Sentence split per text |
| `text_tokens` | Tokenized words/particles with readings |
| `text_phrases` | Admin-defined multi-token phrases |
| `dictionary_entries` | JMdict-style vocabulary |
| `kanji_entries` | KANJIDIC2-style kanji |
| `user_vocabulary` | Saved / known / read words per user |
| `reading_sessions` | Per-text reading progress |
| `ai_explanations` | Cached OpenAI sentence explanations |

## Seed sample texts

```bash
pnpm db:seed
```

Upserts the free MVP texts into `texts` and tokenizes them with Kuromoji.

## Process arbitrary Japanese (Milestone 1)

```bash
pnpm db:process -- --all-samples
pnpm db:process -- --slug live-demo --body "昨日の夜、図書館で日本語の本を読みました。"
```

Programmatic path: `upsertAndProcessText` / `processAndStoreTextTokens`  
Web path: admin `POST /api/admin/texts/process` (see `/admin`)

## Notes

- Prefer Session/Transaction pooler `DATABASE_URL` from Supabase Connect.
- Profile creation happens from the web app on login (`ensureProfile`).
- See `docs/milestone-1-technical-note.md` for M1 limitations.
