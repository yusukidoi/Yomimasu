# @yomimasu/japanese

Japanese text processing for Yomimasu Milestone 1.

## What this package does

- Morphological analysis with **Kuromoji** (`@patdx/kuromoji`)
- Splits text into paragraphs → sentences → tokens
- Returns normalized fields for DB storage:
  - surface, reading (hiragana, kanji-only furigana), lemma, POS, kind, grammar form

## What it does **not** do yet

- English dictionary meanings (JMdict) — next step / admin override
- Persist to Supabase — next milestone step in `@yomimasu/db`
- Admin correction UI — later milestone

## Demo

```bash
pnpm --filter @yomimasu/japanese tokenize:demo
pnpm --filter @yomimasu/japanese tokenize:demo -- "今日もいい一日です。"
```
