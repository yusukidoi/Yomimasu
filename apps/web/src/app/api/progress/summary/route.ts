import { getProgressSummary } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { tryGetDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = tryGetDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const summary = await getProgressSummary(db, user.id);
  return NextResponse.json({ summary });
}
