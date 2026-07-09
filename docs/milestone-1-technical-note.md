# Milestone 1 — Technical note

**Project:** Yomimasu  
**Scope:** Core reader proof of concept (tokenization → Postgres → furigana/popup from stored data)  
**Date:** 2026-07-09  
**Tokenizer:** Kuromoji (`@patdx/kuromoji`) via `packages/japanese`

This note documents what Milestone 1 delivers, known limitations, risks for the full MVP, and what later milestones should improve. It is intended for acceptance review alongside a staging URL and GitHub access.

---

## 1. What was built (acceptance mapping)

| Criterion | Status | How to verify |
|-----------|--------|---------------|
| Process / tokenize a short Japanese text | Done | Admin `/admin` → paste text → **Tokenize & publish**, or CLI `pnpm db:process` |
| Split into paragraphs / sentences / tokens for the reader | Done | Open `/read/[slug]` after processing |
| Token data in Supabase/Postgres (not frontend-only) | Done | Tables `texts`, `text_sentences`, `text_tokens` |
| Token fields: surface, reading, lemma, POS, meaning, order, text ref | Done (meaning often null — see §2) | Inspect `text_tokens` or reader popup |
| Furigana from stored readings, kanji-only | Done | Toggle furigana on reader |
| Furigana ON/OFF | Done | Reader toggle |
| Reader displays processed text | Done | `/read/[slug]` |
| Click word/particle → instant popup | Done | Click any token |
| Popup from stored data, not AI | Done | No OpenAI call on word click |
| Popup: reading, base form, meaning, POS where available | Done | Meaning may be empty for many words |
| Save word persists | Done | Logged-in user → Save → `/app` vocabulary |
| Staging URL | **Requires deploy** | See §4 |
| Code on client GitHub | **Requires push / invite** | See §4 |
| Live extra sentences (not hardcoded) | Done | Process any Japanese via admin or CLI |
| Technical note | This document | — |

**Core technical rule:** Normal word/particle popups use stored token (and optional lexicon) data. AI is not used for lookups. Sentence-level AI explain is out of scope for M1.

---

## 2. Known limitations (honest)

### Tokenization (Kuromoji)

- **Analyzer choice:** M1 uses **Kuromoji**, not Sudachi. Both are valid morphological analyzers; Sudachi (or MeCab) can replace Kuromoji later behind the same `processJapaneseText` → DB interface if preferred.
- **Segmentation quirks:** Verbs and compounds may split (e.g. polite past into stem + auxiliary pieces). Some date/number expressions may split differently than a learner expects.
- **Readings:** Furigana is hiragana and shown only when the surface contains kanji. Kana-only tokens correctly have no furigana.
- **Not a full pedagogical tokenizer:** Boundary decisions follow the dictionary, not graded-reader editorial rules.

### Dictionary / meanings

- **English meanings are incomplete.** Kuromoji provides morphology (surface, reading, lemma, POS), not JMdict glosses.
- Particles get a small built-in meaning map; some sample-lexicon hits may still appear for known demo words.
- Many content words show **meaning: null** until JMdict (or admin override) is wired — **Milestone 2/3**.
- Popup still works: reading, lemma, POS display when present; meaning shows when stored.

### Admin / content workflow

- Admin can **create/update + tokenize** and **reprocess** existing slugs.
- No rich token editor, phrase editor, publish workflow polish, or bulk import UI yet (later milestones).
- Reprocessing **replaces** sentences/tokens for that text (expected for M1).

### Product surface (intentionally out of M1)

- AI “Explain sentence” (cached) — not started.
- Full dashboard charts from live `reading_sessions` — preview/demo data on landing only.
- Stripe / paid library — not started.
- Production hardening (rate limits, observability, content QA) — later.

---

## 3. Risks for the full MVP

| Risk | Impact | Mitigation in later milestones |
|------|--------|--------------------------------|
| Incomplete meanings hurt learner trust | High | Import JMdict (+ optional KANJIDIC2); admin correction UI |
| Over-/under-segmentation | Medium | Prefer Sudachi modes or post-process merges; admin phrase tokens |
| Kuromoji dict size / cold start on serverless | Medium | Keep tokenizer server-side; warm instance or background job for long texts |
| Ambiguous readings (同音異義) | Medium | Dictionary sense ranking + admin override |
| Live “paste any text” without editorial QA | Medium | Draft → review → publish; token correction before publish |
| Pooler / serverless DB connections | Low–medium | Session/transaction pooler (`prepare: false`); avoid direct IPv6-only host on Vercel |

---

## 4. Staging & GitHub (handover checklist)

Local verification already done:

- Production `next build` succeeds with the process API route present.
- Arbitrary Japanese can be upserted and read back from Postgres (e.g. slug `m1-step3-demo`).
- Unauthenticated `POST /api/admin/texts/process` returns **401**.

To complete Flavio’s deploy criteria:

1. **Push** current `main` (or a `milestone-1` branch) to the client GitHub repo.
2. **Vercel** (or equivalent): import the monorepo, set Root / app to `apps/web` (or Turborepo filter), add env for **Preview + Production**:
   - `DATABASE_URL` (Supabase **session/transaction pooler**)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SECRET_KEY` / service role as used by the app
3. Grant the reviewer an **admin** profile (`pnpm admin:grant email`) so they can paste live sentences on `/admin`.
4. Share staging URL + a sample slug (e.g. `/read/m1-step3-demo`) and invite them to paste 2–3 extra sentences.

---

## 5. How to re-test quickly

```bash
# CLI — process arbitrary Japanese into Postgres
pnpm db:process -- --slug flavio-live --body "昨日の夜、図書館で日本語の本を読みました。"

# App — admin UI
# 1. Sign in as admin
# 2. Open /admin → paste Japanese → Tokenize & publish
# 3. Open reader link → furigana + click tokens + save word
```

---

## 6. What later milestones should improve

**Milestone 2 (working MVP direction)**

- JMdict (and optionally KANJIDIC2) matching into `dictionary_entries` / token meanings
- Stronger admin: upload, tokenize, library, roles
- AI sentence explain + cache (`ai_explanations`)
- Dashboard backed by real reading/vocab data

**Milestone 3 (release polish)**

- Token/phrase correction UI
- Segmentation/phrase quality for graded content
- Payments, production deploy, QA, handover docs

---

## 7. Bottom line for acceptance

Milestone 1 proves the **non-hardcoded pipeline**: arbitrary Japanese → morphological analysis → rows in Supabase → reader furigana/popup from those rows → save word. It does **not** yet provide full dictionary coverage or editorial token quality; those are explicit follow-on risks, not hidden gaps.

Once staging is live and the repo is shared, the remaining acceptance items are operational (URL + GitHub), not missing engine work.
