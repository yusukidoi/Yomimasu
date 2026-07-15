/**
 * When the DB was created with `db:push`, `__drizzle_migrations` is empty but
 * tables already exist. `drizzle-kit migrate` then fails re-applying 0000.
 *
 * This script baselines 0000 (if needed) and applies 0001.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import postgres from "postgres";

const rootDir = dirname(fileURLToPath(import.meta.url));
const dbRoot = resolve(rootDir, "../..");
config({ path: resolve(dbRoot, ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = postgres(
  url.includes("sslmode=") ? url : `${url}?sslmode=require`,
  { prepare: false, max: 1 },
);

function migrationHash(filePath: string) {
  const contents = readFileSync(filePath, "utf8");
  return createHash("sha256").update(contents).digest("hex");
}

async function ensureMigrationsTable() {
  await sql`create schema if not exists drizzle`;
  await sql`
    create table if not exists drizzle.__drizzle_migrations (
      id serial primary key,
      hash text not null,
      created_at bigint
    )
  `;
}

async function isApplied(hash: string) {
  const rows = await sql`
    select 1 from drizzle.__drizzle_migrations where hash = ${hash} limit 1
  `;
  return rows.length > 0;
}

async function markApplied(hash: string) {
  await sql`
    insert into drizzle.__drizzle_migrations (hash, created_at)
    values (${hash}, ${Date.now()})
  `;
}

async function main() {
  await ensureMigrationsTable();

  const m0 = resolve(dbRoot, "drizzle/0000_sturdy_silver_samurai.sql");
  const m1 = resolve(dbRoot, "drizzle/0001_flat_rhino.sql");
  const hash0 = migrationHash(m0);
  const hash1 = migrationHash(m1);

  const tables = await sql`
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'texts'
    limit 1
  `;

  if (!(await isApplied(hash0))) {
    if (tables.length === 0) {
      console.error(
        "Baseline skipped: texts table missing. Run full migrate/push first.",
      );
      process.exit(1);
    }
    await markApplied(hash0);
    console.log("Baselined 0000_sturdy_silver_samurai");
  } else {
    console.log("0000 already recorded");
  }

  if (!(await isApplied(hash1))) {
    const hasRole = await sql`
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = 'account_role'
      limit 1
    `;

    if (hasRole.length === 0) {
      await sql.unsafe(`CREATE TYPE "public"."account_role" AS ENUM('free', 'premium')`);
      await sql.unsafe(`
        CREATE TABLE "ai_usage_events" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          "user_id" uuid NOT NULL,
          "text_id" uuid,
          "sentence_id" uuid,
          "cached" boolean DEFAULT false NOT NULL,
          "model" varchar(80),
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL
        )
      `);
      await sql.unsafe(
        `ALTER TABLE "profiles" ADD COLUMN "account_role" "account_role" DEFAULT 'free' NOT NULL`,
      );
      await sql.unsafe(
        `ALTER TABLE "texts" ADD COLUMN "header_image_url" varchar(500)`,
      );
      await sql.unsafe(
        `ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action`,
      );
      await sql.unsafe(
        `ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action`,
      );
      await sql.unsafe(
        `ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_sentence_id_text_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."text_sentences"("id") ON DELETE set null ON UPDATE no action`,
      );
      console.log("Applied 0001_flat_rhino SQL");
    } else {
      console.log("0001 schema already present; recording only");
    }

    await markApplied(hash1);
    console.log("Recorded 0001_flat_rhino");
  } else {
    console.log("0001 already recorded");
  }

  await sql.end();
  console.log("Done.");
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 }).catch(() => undefined);
  process.exit(1);
});
