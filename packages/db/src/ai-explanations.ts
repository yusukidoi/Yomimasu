import { and, eq } from "drizzle-orm";
import type { AiExplanationPayload, JlptLevel } from "@yomimasu/shared";
import type { Database } from "./client";
import { aiExplanations } from "./schema";

function normalizeFocusToken(value?: string | null) {
  return value?.trim() || "";
}

export async function findCachedExplanation(
  db: Database,
  input: {
    sentenceSurface: string;
    selectedTokenSurface?: string | null;
    userLevel: JlptLevel;
  },
) {
  const selectedTokenSurface = normalizeFocusToken(input.selectedTokenSurface);

  return db.query.aiExplanations.findFirst({
    where: and(
      eq(aiExplanations.sentenceSurface, input.sentenceSurface),
      eq(aiExplanations.selectedTokenSurface, selectedTokenSurface),
      eq(aiExplanations.userLevel, input.userLevel),
    ),
  });
}

export async function storeExplanation(
  db: Database,
  input: {
    textId?: string | null;
    sentenceId?: string | null;
    sentenceSurface: string;
    selectedTokenSurface?: string | null;
    userLevel: JlptLevel;
    response: AiExplanationPayload;
    model?: string | null;
  },
) {
  const selectedTokenSurface = normalizeFocusToken(input.selectedTokenSurface);

  const existing = await findCachedExplanation(db, {
    sentenceSurface: input.sentenceSurface,
    selectedTokenSurface,
    userLevel: input.userLevel,
  });

  if (existing) {
    const [updated] = await db
      .update(aiExplanations)
      .set({
        textId: input.textId ?? existing.textId,
        sentenceId: input.sentenceId ?? existing.sentenceId,
        response: input.response,
        model: input.model ?? existing.model,
        updatedAt: new Date(),
      })
      .where(eq(aiExplanations.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(aiExplanations)
    .values({
      textId: input.textId ?? null,
      sentenceId: input.sentenceId ?? null,
      sentenceSurface: input.sentenceSurface,
      selectedTokenSurface,
      userLevel: input.userLevel,
      response: input.response,
      model: input.model ?? null,
    })
    .returning();

  return created;
}
