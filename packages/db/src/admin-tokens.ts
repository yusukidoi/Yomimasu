import { and, asc, eq } from "drizzle-orm";
import type { Database } from "./client";
import { textTokens, texts } from "./schema";

export type UpdateTokenInput = {
  meaningOverride?: string | null;
  meaning?: string | null;
  reading?: string | null;
  lemma?: string | null;
  grammarForm?: string | null;
};

export async function listTokensForTextSlug(db: Database, slug: string) {
  const text = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });
  if (!text) return null;

  const tokens = await db.query.textTokens.findMany({
    where: eq(textTokens.textId, text.id),
    orderBy: [asc(textTokens.index)],
  });

  return { text, tokens };
}

export async function updateTextToken(
  db: Database,
  tokenId: string,
  input: UpdateTokenInput,
) {
  const existing = await db.query.textTokens.findFirst({
    where: eq(textTokens.id, tokenId),
  });
  if (!existing) return null;

  const [updated] = await db
    .update(textTokens)
    .set({
      meaningOverride:
        input.meaningOverride !== undefined
          ? input.meaningOverride
          : existing.meaningOverride,
      meaning: input.meaning !== undefined ? input.meaning : existing.meaning,
      reading: input.reading !== undefined ? input.reading : existing.reading,
      lemma: input.lemma !== undefined ? input.lemma : existing.lemma,
      grammarForm:
        input.grammarForm !== undefined
          ? input.grammarForm
          : existing.grammarForm,
      updatedAt: new Date(),
    })
    .where(eq(textTokens.id, tokenId))
    .returning();

  return updated;
}

export async function setTextPublishStatus(
  db: Database,
  slug: string,
  status: "draft" | "published" | "archived",
) {
  const existing = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
  });
  if (!existing) return null;

  const [updated] = await db
    .update(texts)
    .set({
      status,
      publishedAt:
        status === "published"
          ? (existing.publishedAt ?? new Date())
          : null,
      updatedAt: new Date(),
    })
    .where(eq(texts.slug, slug))
    .returning();

  return updated ?? null;
}

export async function assertTokenBelongsToSlug(
  db: Database,
  tokenId: string,
  slug: string,
) {
  const text = await db.query.texts.findFirst({
    where: eq(texts.slug, slug),
    columns: { id: true, slug: true, title: true, status: true },
  });
  if (!text) return null;

  const token = await db.query.textTokens.findFirst({
    where: and(eq(textTokens.id, tokenId), eq(textTokens.textId, text.id)),
  });
  return token ? { text, token } : null;
}
