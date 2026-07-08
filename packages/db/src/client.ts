import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof createDb>;

export function createDb(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required. Copy packages/db/.env.example to packages/db/.env or set it in the environment.",
    );
  }

  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}
