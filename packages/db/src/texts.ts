import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { texts } from "./schema";

export async function getTextBySlug(db: Database, slug: string) {
  return db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });
}

export async function listPublishedTexts(db: Database) {
  return db.query.texts.findMany({
    where: eq(texts.status, "published"),
    orderBy: (table, { asc }) => [asc(table.level), asc(table.title)],
  });
}
