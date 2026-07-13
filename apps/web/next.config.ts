import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { NextConfig } from "next";

const require = createRequire(import.meta.url);

function kuromojiDictTracingPaths(): string[] {
  const paths = [
    "../../packages/japanese/vendor/dict/**/*",
  ];

  try {
    const dictDir = join(dirname(require.resolve("@patdx/kuromoji")), "..", "dict");
    paths.push(`${dictDir.replace(/\\/g, "/")}/**/*`);
  } catch {
    // @patdx/kuromoji may not resolve during config load on CI — vendored path is enough.
  }

  return paths;
}

const nextConfig: NextConfig = {
  // Kuromoji loads dictionary files from disk at runtime — keep external.
  serverExternalPackages: ["@patdx/kuromoji", "@yomimasu/japanese"],
  transpilePackages: ["@yomimasu/db", "@yomimasu/shared"],
  // Include dict files in the serverless bundle (Vercel).
  outputFileTracingIncludes: {
    "/api/admin/texts/process": kuromojiDictTracingPaths(),
  },
};

export default nextConfig;
