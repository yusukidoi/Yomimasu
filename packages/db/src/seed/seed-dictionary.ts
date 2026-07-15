import "dotenv/config";
import { createDb } from "../client";
import { seedDictionaryEntries } from "../dictionary";

async function main() {
  const db = createDb(process.env.DATABASE_URL);
  const result = await seedDictionaryEntries(db);
  console.log(`Seeded/updated ${result.upserted} JMDict-style dictionary entries.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
