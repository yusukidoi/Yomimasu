import { APP_NAME, type HealthResponse } from "@yomimasu/shared";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const payload: HealthResponse = {
    status: "ok",
    service: "yomimasu-api",
    timestamp: new Date().toISOString(),
  };

  let authenticated = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authenticated = Boolean(user);
  } catch {
    authenticated = false;
  }

  return NextResponse.json({
    ...payload,
    app: APP_NAME,
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    authenticated,
  });
}
