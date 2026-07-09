import { redirect } from "next/navigation";
import { ensureProfile } from "@yomimasu/db";
import { getDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireAdmin(nextPath: string) {
  const user = await requireUser(nextPath);
  const profile = await ensureProfile(getDb(), {
    id: user.id,
    email: user.email,
  });

  if (!profile.isAdmin) {
    redirect("/app");
  }

  return { user, profile };
}
