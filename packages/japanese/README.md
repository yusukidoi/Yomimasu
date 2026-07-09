# @yomimasu/japanese

Japanese text processing for Yomimasu Milestone 1.

## What this package does

- Morphological analysis with **Kuromoji** (`@patdx/kuromoji`)
- Splits text into paragraphs → sentences → tokens
- Returns normalized fields for DB storage:
  - surface, reading (hiragana, kanji-only furigana), lemma, POS, kind, grammar form

## What it does **not** do yet

- English dictionary meanings (JMdict) — Milestone 2+
- Admin correction of bad splits — Milestone 3
- Persistence — handled by `@yomimasu/db` (`processAndStoreTextTokens` / `upsertAndProcessText`)

## Demo

```bash
pnpm --filter @yomimasu/japanese tokenize:demo
pnpm --filter @yomimasu/japanese tokenize:demo -- "今日もいい一日です。"
```

See also: [`docs/milestone-1-technical-note.md`](../../docs/milestone-1-technical-note.md).
