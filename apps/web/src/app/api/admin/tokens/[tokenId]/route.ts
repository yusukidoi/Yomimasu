import { updateTextToken } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type PatchBody = {
  meaningOverride?: string | null;
  meaning?: string | null;
  reading?: string | null;
  lemma?: string | null;
  grammarForm?: string | null;
};

type RouteProps = {
  params: Promise<{ tokenId: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const { user, profile } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { tokenId } = await params;
  const body = (await request.json()) as PatchBody;
  const updated = await updateTextToken(getDb(), tokenId, body);

  if (!updated) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  return NextResponse.json({ token: updated });
}
