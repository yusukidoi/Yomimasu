/**
 * Process a text with Kuromoji and store tokens in Supabase/Postgres.
 *
 * Examples:
 *   pnpm --filter @yomimasu/db db:process -- --slug n5-morning-routine
 *   pnpm --filter @yomimasu/db db:process -- --slug live-demo --body "昨日の夜、図書館で日本語の本を読みました。"
 *   pnpm --filter @yomimasu/db db:process -- --all-samples
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../client";
import { texts } from "../schema";
import { processAndStoreTextTokens, processTextBySlug } from "../process-text";
import { SAMPLE_TEXTS } from "./sample-texts";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

function readArg(name: string) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

async function ensureTextFromBody(slug: string, body: string) {
  const db = createDb();
  const existing = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });

  if (existing) {
    const [updated] = await db
      .update(texts)
      .set({
        body,
        status: "published",
        isFree: true,
        updatedAt: new Date(),
        publishedAt: existing.publishedAt ?? new Date(),
      })
      .where(eq(texts.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(texts)
    .values({
      slug,
      title: slug,
      body,
      level: "N5",
      status: "published",
      isFree: true,
      publishedAt: new Date(),
      estimatedMinutes: 3,
      wordCount: 0,
    })
    .returning();

  return created;
}

async function main() {
  const db = createDb();
  const slug = readArg("--slug");
  const body = readArg("--body");
  const allSamples = process.argv.includes("--all-samples");

  if (allSamples) {
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
            updatedAt: new Date(),
            publishedAt: existing.publishedAt ?? new Date(),
          })
          .where(eq(texts.slug, sample.slug))
          .returning();
        textId = updated.id;
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
            publishedAt: new Date(),
          })
          .returning();
        textId = created.id;
      }

      const result = await processAndStoreTextTokens(db, textId, sample.body);
      console.log(
        `processed ${sample.slug}: ${result.sentenceCount} sentences, ${result.tokenCount} tokens`,
      );
    }
    return;
  }

  if (!slug) {
    console.error(
      "Usage:\n  --all-samples\n  --slug <slug>\n  --slug <slug> --body \"日本語...\"",
    );
    process.exit(1);
  }

  if (body) {
    const text = await ensureTextFromBody(slug, body);
    const result = await processAndStoreTextTokens(db, text.id, body);
    console.log(
      `processed ${slug}: ${result.sentenceCount} sentences, ${result.tokenCount} tokens`,
    );
    return;
  }

  const result = await processTextBySlug(db, slug);
  console.log(
    `processed ${slug}: ${result.sentenceCount} sentences, ${result.tokenCount} tokens`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Process failed:", error);
    process.exit(1);
  });
