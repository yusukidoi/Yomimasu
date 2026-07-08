import { createDb, type Database } from "@yomimasu/db";

const globalForDb = globalThis as unknown as {
  yomimasuDb?: Database;
};

function normalizeDatabaseUrl(url: string | undefined) {
  if (!url) return undefined;
  return url.replace(/^["']|["']$/g, "");
}

export function getDb() {
  if (!globalForDb.yomimasuDb) {
    globalForDb.yomimasuDb = createDb(
      normalizeDatabaseUrl(process.env.DATABASE_URL),
    );
  }
  return globalForDb.yomimasuDb;
}
