import { asc, eq } from "drizzle-orm";
import type { ReaderSentence, ReaderText, ReaderToken } from "@yomimasu/shared";
import type { Database } from "./client";
import { textSentences, texts, textTokens } from "./schema";

export async function getTextBySlug(db: Database, slug: string) {
  return db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });
}

export async function listPublishedTexts(db: Database) {
  return db.query.texts.findMany({
    where: eq(texts.status, "published"),
    orderBy: (table, { asc: ascFn }) => [ascFn(table.level), ascFn(table.title)],
  });
}

export async function getTextForReader(
  db: Database,
  slug: string,
): Promise<ReaderText | null> {
  const text = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });

  if (!text) return null;

  const sentences = await db.query.textSentences.findMany({
    where: eq(textSentences.textId, text.id),
    orderBy: [asc(textSentences.index)],
  });

  const tokens = await db.query.textTokens.findMany({
    where: eq(textTokens.textId, text.id),
    orderBy: [asc(textTokens.index)],
  });

  const tokensBySentence = new Map<string, ReaderToken[]>();
  for (const token of tokens) {
    if (!token.sentenceId) continue;
    const list = tokensBySentence.get(token.sentenceId) ?? [];
    list.push({
      id: token.id,
      index: token.index,
      surface: token.surface,
      reading: token.reading,
      lemma: token.lemma,
      meaning: token.meaningOverride ?? token.meaning,
      partOfSpeech: token.partOfSpeech,
      kind: token.kind,
      grammarForm: token.grammarForm,
    });
    tokensBySentence.set(token.sentenceId, list);
  }

  const readerSentences: ReaderSentence[] = sentences.map((sentence) => ({
    id: sentence.id,
    index: sentence.index,
    surface: sentence.surface,
    tokens: tokensBySentence.get(sentence.id) ?? [],
  }));

  return {
    id: text.id,
    slug: text.slug,
    title: text.title,
    titleJa: text.titleJa,
    level: text.level,
    topic: text.topic,
    summary: text.summary,
    translationEn: text.translationEn,
    estimatedMinutes: text.estimatedMinutes,
    wordCount: text.wordCount,
    isFree: text.isFree,
    sentences: readerSentences,
  };
}
