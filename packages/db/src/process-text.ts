import { processJapaneseText } from "@yomimasu/japanese";
import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { findDictionaryMatch } from "./dictionary";
import { lookupTokenMeaning } from "./meanings/lookup";
import { textSentences, texts, textTokens } from "./schema";

export type ProcessTextResult = {
  textId: string;
  sentenceCount: number;
  tokenCount: number;
};

/**
 * Run Kuromoji on a text body and replace stored sentences/tokens in Postgres.
 * Meanings resolve from dictionary_entries (JMDict-style seed) then local maps.
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

    const tokenRows = [];
    for (const token of sentence.tokens) {
      const dictMatch =
        token.kind === "punctuation"
          ? null
          : await findDictionaryMatch(db, token.lemma, token.surface);

      tokenRows.push({
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
          dictMatch?.primaryMeaning ??
          lookupTokenMeaning(token.surface, token.lemma, token.kind),
        dictionaryEntryId: dictMatch?.id ?? null,
        grammarForm: token.grammarForm,
      });
    }

    await db.insert(textTokens).values(tokenRows);
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

export type UpsertAndProcessTextInput = {
  slug: string;
  title: string;
  body: string;
  level?: "N5" | "N4" | "N3";
  isFree?: boolean;
  status?: "draft" | "published";
  topic?: string | null;
  headerImageUrl?: string | null;
};

export type UpsertAndProcessTextResult = ProcessTextResult & {
  slug: string;
  title: string;
  created: boolean;
  status: "draft" | "published";
};

/**
 * Create or update a text row, then tokenize with Kuromoji into Postgres.
 */
export async function upsertAndProcessText(
  db: Database,
  input: UpsertAndProcessTextInput,
): Promise<UpsertAndProcessTextResult> {
  const level = input.level ?? "N5";
  const isFree = input.isFree ?? true;
  const status = input.status ?? "published";
  const topic = input.topic?.trim() || null;
  const headerImageUrl = input.headerImageUrl?.trim() || null;
  const existing = await db.query.texts.findFirst({
    where: eq(texts.slug, input.slug),
  });

  let textId: string;
  let created = false;

  if (existing) {
    const [updated] = await db
      .update(texts)
      .set({
        title: input.title,
        body: input.body,
        level,
        status,
        isFree,
        topic,
        headerImageUrl,
        updatedAt: new Date(),
        publishedAt:
          status === "published"
            ? (existing.publishedAt ?? new Date())
            : null,
        estimatedMinutes: Math.max(1, Math.ceil(input.body.length / 80)),
      })
      .where(eq(texts.id, existing.id))
      .returning();
    textId = updated.id;
  } else {
    const [inserted] = await db
      .insert(texts)
      .values({
        slug: input.slug,
        title: input.title,
        body: input.body,
        level,
        status,
        isFree,
        topic,
        headerImageUrl,
        publishedAt: status === "published" ? new Date() : null,
        estimatedMinutes: Math.max(1, Math.ceil(input.body.length / 80)),
        wordCount: 0,
      })
      .returning();
    textId = inserted.id;
    created = true;
  }

  const result = await processAndStoreTextTokens(db, textId, input.body);

  return {
    ...result,
    slug: input.slug,
    title: input.title,
    created,
    status,
  };
}
