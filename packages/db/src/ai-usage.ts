import type { Database } from "./client";
import { aiUsageEvents } from "./schema";
import { eq } from "drizzle-orm";

export async function recordAiUsageEvent(
  db: Database,
  input: {
    userId: string;
    textId?: string | null;
    sentenceId?: string | null;
    cached: boolean;
    model?: string | null;
  },
) {
  const [created] = await db
    .insert(aiUsageEvents)
    .values({
      userId: input.userId,
      textId: input.textId ?? null,
      sentenceId: input.sentenceId ?? null,
      cached: input.cached,
      model: input.model ?? null,
    })
    .returning();
  return created;
}

export async function countUserAiUsage(db: Database, userId: string) {
  const rows = await db.query.aiUsageEvents.findMany({
    where: eq(aiUsageEvents.userId, userId),
    columns: { cached: true },
  });
  return {
    total: rows.length,
    cached: rows.filter((row) => row.cached).length,
    fresh: rows.filter((row) => !row.cached).length,
  };
}
