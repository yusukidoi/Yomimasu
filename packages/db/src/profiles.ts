import { eq } from "drizzle-orm";
import type { Database } from "./client";
import { profiles } from "./schema";

export type EnsureProfileInput = {
  id: string;
  email?: string | null;
  displayName?: string | null;
};

/**
 * Creates a profiles row for a Supabase Auth user if one does not exist yet.
 * Safe to call on every login / dashboard visit.
 */
export async function ensureProfile(db: Database, input: EnsureProfileInput) {
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.id, input.id),
  });

  if (existing) {
    if (input.email && existing.email !== input.email) {
      const [updated] = await db
        .update(profiles)
        .set({
          email: input.email,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, input.id))
        .returning();
      return updated;
    }
    return existing;
  }

  const [created] = await db
    .insert(profiles)
    .values({
      id: input.id,
      email: input.email ?? null,
      displayName: input.displayName ?? null,
    })
    .returning();

  return created;
}

export async function getProfileById(db: Database, userId: string) {
  return db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });
}

export async function setProfileAdmin(
  db: Database,
  userId: string,
  isAdmin: boolean,
) {
  const [updated] = await db
    .update(profiles)
    .set({ isAdmin, updatedAt: new Date() })
    .where(eq(profiles.id, userId))
    .returning();
  return updated;
}
