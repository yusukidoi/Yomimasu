import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../client";
import { profiles } from "../schema";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

const email = process.argv[2];
const role = process.argv[3] as "free" | "premium" | undefined;

if (!email || (role !== "free" && role !== "premium")) {
  console.error("Usage: pnpm role:set your@email.com free|premium");
  process.exit(1);
}

async function setRole() {
  const db = createDb();
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });

  if (!profile) {
    console.error(
      `No profile found for ${email}. Sign up once in the app, then run this again.`,
    );
    process.exit(1);
  }

  await db
    .update(profiles)
    .set({ accountRole: role, updatedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  console.log(`Set account role for ${email} to ${role}`);
  process.exit(0);
}

setRole().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
