import { asc } from "drizzle-orm";
import type { Database } from "./client";
import { texts } from "./schema";

export async function listAllTexts(db: Database) {
  return db.query.texts.findMany({
    orderBy: [asc(texts.level), asc(texts.title)],
  });
}
