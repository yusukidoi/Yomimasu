import { listUserVocabulary, saveUserVocabulary } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

type SaveBody = {
  surface?: string;
  lemma?: string | null;
  reading?: string | null;
  meaning?: string | null;
  status?: "saved" | "known";
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SaveBody;
  if (!body.surface) {
    return NextResponse.json({ error: "surface is required" }, { status: 400 });
  }

  const vocabulary = await saveUserVocabulary(getDb(), {
    userId: user.id,
    surface: body.surface,
    lemma: body.lemma,
    reading: body.reading,
    meaning: body.meaning,
    status: body.status,
  });

  return NextResponse.json({ vocabulary });
}
