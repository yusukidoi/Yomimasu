import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(rootDir, ".env");

const loaded = config({ path: envPath });

if (loaded.error) {
  console.warn(`[drizzle] Could not read ${envPath}:`, loaded.error.message);
} else {
  const count = Object.keys(loaded.parsed ?? {}).length;
  console.log(`[drizzle] Loaded ${count} env var(s) from ${envPath}`);
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "[drizzle] DATABASE_URL is not set. Copy packages/db/.env.example to packages/db/.env.",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl
      ? databaseUrl.includes("sslmode=")
        ? databaseUrl
        : `${databaseUrl}?sslmode=require`
      : "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  },
  strict: true,
  verbose: true,
});
