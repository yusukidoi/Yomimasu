function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in apps/web/.env and restart the dev server.`,
    );
  }
  return value;
}

export function getSupabaseEnv() {
  return {
    url: required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    anonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}
