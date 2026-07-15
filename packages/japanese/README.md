# @yomimasu/japanese

Japanese text processing for Yomimasu.

## What this package does

- Morphological analysis with **Kuromoji** (`@patdx/kuromoji`)
- Splits text into paragraphs → sentences → tokens
- Returns normalized fields for DB storage:
  - surface, reading (hiragana, kanji-only furigana), lemma, POS, kind, grammar form

## Related (in `@yomimasu/db`, not this package)

- English dictionary meanings via `dictionary_entries` (JMDict-style seed) + process-time lookup
- Persistence: `processAndStoreTextTokens` / `upsertAndProcessText`

## Demo

```bash
pnpm --filter @yomimasu/japanese tokenize:demo
pnpm --filter @yomimasu/japanese tokenize:demo -- "今日もいい一日です。"
```

Seed dictionary meanings (DB):

```bash
pnpm db:seed-dictionary
```

See also: [`docs/milestone-1-technical-note.md`](../../docs/milestone-1-technical-note.md).
