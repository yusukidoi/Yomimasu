import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../client";
import { textSentences, texts, textTokens } from "../schema";
import { SAMPLE_TEXTS } from "./sample-texts";
import { splitSentences, tokenizeSentence } from "./tokenize";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

async function seedTextTokens(
  textId: string,
  body: string,
) {
  const db = createDb();
  const sentences = splitSentences(body);

  await db.delete(textTokens).where(eq(textTokens.textId, textId));
  await db.delete(textSentences).where(eq(textSentences.textId, textId));

  let globalTokenIndex = 0;

  for (const [sentenceIndex, surface] of sentences.entries()) {
    const [sentence] = await db
      .insert(textSentences)
      .values({
        textId,
        index: sentenceIndex,
        surface,
      })
      .returning();

    const demoTokens = tokenizeSentence(surface);

    if (demoTokens.length > 0) {
      await db.insert(textTokens).values(
        demoTokens.map((token) => ({
          textId,
          sentenceId: sentence.id,
          index: globalTokenIndex,
          surface: token.surface,
          lemma: token.lemma,
          reading: token.reading,
          partOfSpeech: token.partOfSpeech,
          kind: token.kind,
          meaning: token.meaning,
          grammarForm: token.grammarForm,
        })),
      );
      globalTokenIndex += demoTokens.length;
    }
  }
}

async function seed() {
  const db = createDb();
  const now = new Date();

  for (const sample of SAMPLE_TEXTS) {
    const existing = await db.query.texts.findFirst({
      where: eq(texts.slug, sample.slug),
    });

    let textId: string;

    if (existing) {
      const [updated] = await db
        .update(texts)
        .set({
          title: sample.title,
          titleJa: sample.titleJa,
          level: sample.level,
          topic: sample.topic,
          summary: sample.summary,
          body: sample.body,
          translationEn: sample.translationEn,
          status: sample.status,
          isFree: sample.isFree,
          estimatedMinutes: sample.estimatedMinutes,
          wordCount: sample.wordCount,
          publishedAt: existing.publishedAt ?? now,
          updatedAt: now,
        })
        .where(eq(texts.slug, sample.slug))
        .returning();
      textId = updated.id;
      console.log(`updated: ${sample.slug}`);
    } else {
      const [created] = await db
        .insert(texts)
        .values({
          slug: sample.slug,
          title: sample.title,
          titleJa: sample.titleJa,
          level: sample.level,
          topic: sample.topic,
          summary: sample.summary,
          body: sample.body,
          translationEn: sample.translationEn,
          status: sample.status,
          isFree: sample.isFree,
          estimatedMinutes: sample.estimatedMinutes,
          wordCount: sample.wordCount,
          publishedAt: now,
        })
        .returning();
      textId = created.id;
      console.log(`inserted: ${sample.slug}`);
    }

    await seedTextTokens(textId, sample.body);
    console.log(`tokenized: ${sample.slug}`);
  }

  console.log(`Seeded ${SAMPLE_TEXTS.length} free texts with tokens.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
