import { createDb, type Database } from "@yomimasu/db";

const globalForDb = globalThis as unknown as {
  yomimasuDb?: Database;
};

function normalizeDatabaseUrl(url: string | undefined) {
  if (!url) return undefined;
  return url.replace(/^["']|["']$/g, "");
}

export function hasDatabaseUrl() {
  return Boolean(normalizeDatabaseUrl(process.env.DATABASE_URL));
}

export function getDb() {
  if (!hasDatabaseUrl()) {
    throw new Error(
      "DATABASE_URL is required. Set it in apps/web/.env (local) or Vercel project env (production).",
    );
  }

  if (!globalForDb.yomimasuDb) {
    globalForDb.yomimasuDb = createDb(
      normalizeDatabaseUrl(process.env.DATABASE_URL),
    );
  }
  return globalForDb.yomimasuDb;
}

export function tryGetDb() {
  if (!hasDatabaseUrl()) return null;
  return getDb();
}
