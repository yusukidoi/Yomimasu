import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const sql = postgres(
  url.includes("sslmode=") ? url : `${url}?sslmode=require`,
  { prepare: false, max: 1 },
);

async function main() {
  const migrations = await sql`
    select id, hash, created_at
    from drizzle.__drizzle_migrations
    order by created_at
  `.catch(async (error) => {
    console.error("Could not read drizzle.__drizzle_migrations:", error.message);
    return [];
  });

  console.log("Applied migrations:", migrations);

  const cols = await sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and (
        (table_name = 'profiles' and column_name = 'account_role')
        or (table_name = 'texts' and column_name = 'header_image_url')
        or (table_name = 'ai_usage_events' and column_name = 'id')
      )
    order by table_name, column_name
  `;
  console.log("M2 columns/tables present:", cols);

  const enums = await sql`
    select t.typname
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'account_role'
  `;
  console.log("account_role enum:", enums);

  const tables = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
    order by table_name
  `;
  console.log(
    "public tables:",
    tables.map((row) => row.table_name),
  );

  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 }).catch(() => undefined);
  process.exit(1);
});
