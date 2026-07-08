import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = ReturnType<typeof createDb>;

function normalizeDatabaseUrl(connectionString: string) {
  return connectionString.replace(/^["']|["']$/g, "");
}

export function createDb(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required. Copy packages/db/.env.example to packages/db/.env or set it in the environment.",
    );
  }

  const client = postgres(normalizeDatabaseUrl(connectionString), {
    prepare: false,
  });
  return drizzle(client, { schema });
}
