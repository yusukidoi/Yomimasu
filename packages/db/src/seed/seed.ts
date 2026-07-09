import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../client";
import { texts } from "../schema";
import { processAndStoreTextTokens } from "../process-text";
import { SAMPLE_TEXTS } from "./sample-texts";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

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
          wordCount: 0,
          publishedAt: now,
        })
        .returning();
      textId = created.id;
      console.log(`inserted: ${sample.slug}`);
    }

    const result = await processAndStoreTextTokens(db, textId, sample.body);
    console.log(
      `tokenized with Kuromoji: ${sample.slug} (${result.tokenCount} tokens)`,
    );
  }

  console.log(`Seeded ${SAMPLE_TEXTS.length} free texts with Kuromoji tokens.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
