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

## Notes

- Do not run migrations until a Postgres instance is available.
- Auth wiring (Supabase client in `apps/web`) is a later step.
