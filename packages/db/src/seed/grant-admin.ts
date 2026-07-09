import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../client";
import { profiles } from "../schema";

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, "../../.env") });

const email = process.argv[2];

if (!email) {
  console.error("Usage: pnpm admin:grant your@email.com");
  process.exit(1);
}

async function grantAdmin() {
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
    .set({ isAdmin: true, updatedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  console.log(`Granted admin to ${email}`);
  process.exit(0);
}

grantAdmin().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
