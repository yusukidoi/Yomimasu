import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, "../vendor/dict");

const require = createRequire(join(here, "../package.json"));
const entry = require.resolve("@patdx/kuromoji");
const source = join(dirname(entry), "..", "dict");

if (!existsSync(join(source, "base.dat.gz"))) {
  console.error("[kuromoji] dict source not found:", source);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true, force: true });
console.log("[kuromoji] copied dict to", target);
