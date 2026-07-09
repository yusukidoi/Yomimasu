import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kuromoji loads dictionary files from disk at runtime — keep external.
  serverExternalPackages: ["@patdx/kuromoji", "@yomimasu/japanese"],
  transpilePackages: ["@yomimasu/db", "@yomimasu/shared"],
};

export default nextConfig;
