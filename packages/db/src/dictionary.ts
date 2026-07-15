import { eq, or, sql } from "drizzle-orm";
import type { Database } from "./client";
import {
  COMMON_LEMMA_MEANINGS,
  COMMON_SURFACE_MEANINGS,
} from "./meanings/common-words";
import { dictionaryEntries } from "./schema";

export type DictionaryMatch = {
  id: string;
  lemma: string;
  reading: string | null;
  meanings: string[];
  primaryMeaning: string;
};

/**
 * Seed `dictionary_entries` from the high-frequency JMDict-style word list.
 * Safe to re-run (upserts on source + externalId).
 */
export async function seedDictionaryEntries(db: Database) {
  const rows = Object.entries(COMMON_LEMMA_MEANINGS).map(([lemma, meaning]) => ({
    lemma,
    reading: null as string | null,
    partOfSpeech: null as string | null,
    meanings: [meaning],
    source: "jmdict" as const,
    externalId: `common-${lemma}`,
  }));

  // Surface-only entries that differ from lemma.
  for (const [surface, meaning] of Object.entries(COMMON_SURFACE_MEANINGS)) {
    if (COMMON_LEMMA_MEANINGS[surface]) continue;
    rows.push({
      lemma: surface,
      reading: null,
      partOfSpeech: null,
      meanings: [meaning],
      source: "jmdict",
      externalId: `surface-${surface}`,
    });
  }

  let upserted = 0;
  const chunkSize = 80;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await db
      .insert(dictionaryEntries)
      .values(chunk)
      .onConflictDoUpdate({
        target: [dictionaryEntries.source, dictionaryEntries.externalId],
        set: {
          meanings: sql`excluded.meanings`,
          lemma: sql`excluded.lemma`,
          updatedAt: new Date(),
        },
      });
    upserted += chunk.length;
  }

  return { upserted };
}

export async function findDictionaryMatch(
  db: Database,
  lemma: string | null,
  surface: string,
): Promise<DictionaryMatch | null> {
  const keys = [lemma, surface].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  if (keys.length === 0) return null;

  const unique = [...new Set(keys)];
  const entry = await db.query.dictionaryEntries.findFirst({
    where: or(...unique.map((key) => eq(dictionaryEntries.lemma, key))),
  });

  if (!entry || entry.meanings.length === 0) return null;

  return {
    id: entry.id,
    lemma: entry.lemma,
    reading: entry.reading,
    meanings: entry.meanings,
    primaryMeaning: entry.meanings[0] ?? "",
  };
}
