import { processJapaneseText } from "@yomimasu/japanese";
import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { textSentences, texts, textTokens } from "./schema";
import { DEMO_LEXICON } from "./seed/token-dictionary";

const PARTICLE_MEANINGS: Record<string, string> = {
  は: "topic marker",
  が: "subject marker",
  を: "object marker",
  に: "time / location / indirect object marker",
  へ: "direction marker",
  で: "location of action / means",
  と: "with / and",
  も: "also / too",
  の: "possessive / modifier",
  から: "from / because",
  まで: "until / as far as",
  より: "than / from",
  や: "and (incomplete list)",
  ね: "seeking agreement",
  よ: "emphasis",
  か: "question marker",
};

const meaningBySurface = new Map(
  DEMO_LEXICON.map((entry) => [entry.surface, entry.meaning] as const),
);
const meaningByLemma = new Map(
  DEMO_LEXICON.map((entry) => [entry.lemma, entry.meaning] as const),
);

function lookupMeaning(surface: string, lemma: string | null, kind: string) {
  if (kind === "particle") {
    return PARTICLE_MEANINGS[surface] ?? PARTICLE_MEANINGS[lemma ?? ""] ?? null;
  }
  return (
    meaningBySurface.get(surface) ??
    (lemma ? meaningByLemma.get(lemma) : undefined) ??
    null
  );
}

export type ProcessTextResult = {
  textId: string;
  sentenceCount: number;
  tokenCount: number;
};

/**
 * Run Kuromoji on a text body and replace stored sentences/tokens in Postgres.
 * This is the Milestone 1 persistence path (not frontend-only state).
 */
export async function processAndStoreTextTokens(
  db: Database,
  textId: string,
  body: string,
): Promise<ProcessTextResult> {
  const processed = await processJapaneseText(body);

  await db.delete(textTokens).where(eq(textTokens.textId, textId));
  await db.delete(textSentences).where(eq(textSentences.textId, textId));

  for (const sentence of processed.sentences) {
    const [savedSentence] = await db
      .insert(textSentences)
      .values({
        textId,
        index: sentence.index,
        surface: sentence.surface,
      })
      .returning();

    if (sentence.tokens.length === 0) continue;

    await db.insert(textTokens).values(
      sentence.tokens.map((token) => ({
        textId,
        sentenceId: savedSentence.id,
        index: token.index,
        surface: token.surface,
        lemma: token.lemma,
        reading: token.reading,
        partOfSpeech: token.partOfSpeech,
        kind: token.kind,
        meaning:
          token.meaning ??
          lookupMeaning(token.surface, token.lemma, token.kind),
        grammarForm: token.grammarForm,
      })),
    );
  }

  await db
    .update(texts)
    .set({
      wordCount: processed.tokenCount,
      updatedAt: new Date(),
    })
    .where(eq(texts.id, textId));

  return {
    textId,
    sentenceCount: processed.sentences.length,
    tokenCount: processed.tokenCount,
  };
}

/**
 * Process an existing text row by slug (body already in DB).
 */
export async function processTextBySlug(db: Database, slug: string) {
  const text = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });

  if (!text) {
    throw new Error(`Text not found for slug: ${slug}`);
  }

  return processAndStoreTextTokens(db, text.id, text.body);
}
