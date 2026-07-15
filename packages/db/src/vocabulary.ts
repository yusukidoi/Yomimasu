import { and, desc, eq } from "drizzle-orm";
import type { WordStatus } from "@yomimasu/shared";
import type { Database } from "./client";
import { userVocabulary } from "./schema";

export type SaveVocabularyInput = {
  userId: string;
  surface: string;
  lemma?: string | null;
  reading?: string | null;
  meaning?: string | null;
  status?: Extract<WordStatus, "saved" | "known">;
};

export async function saveUserVocabulary(db: Database, input: SaveVocabularyInput) {
  const status = input.status === "known" ? "known" : "saved";
  const lemma = input.lemma ?? input.surface;

  const existing = await db.query.userVocabulary.findFirst({
    where: and(
      eq(userVocabulary.userId, input.userId),
      eq(userVocabulary.surface, input.surface),
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(userVocabulary)
      .set({
        status,
        lemma,
        reading: input.reading ?? existing.reading,
        meaning: input.meaning ?? existing.meaning,
        timesClicked: existing.timesClicked + 1,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userVocabulary.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(userVocabulary)
    .values({
      userId: input.userId,
      surface: input.surface,
      lemma,
      reading: input.reading ?? null,
      meaning: input.meaning ?? null,
      status,
      timesClicked: 1,
      lastSeenAt: new Date(),
    })
    .returning();

  return created;
}

export async function listUserVocabulary(db: Database, userId: string, limit = 8) {
  return db.query.userVocabulary.findMany({
    where: eq(userVocabulary.userId, userId),
    orderBy: [desc(userVocabulary.updatedAt)],
    limit,
  });
}

export async function countUserVocabulary(db: Database, userId: string) {
  const rows = await db.query.userVocabulary.findMany({
    where: eq(userVocabulary.userId, userId),
    columns: { status: true },
  });
  return {
    total: rows.length,
    saved: rows.filter((row) => row.status === "saved").length,
    known: rows.filter((row) => row.status === "known").length,
    read: rows.filter((row) => row.status === "read").length,
  };
}
