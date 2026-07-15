import { setTextPublishStatus } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const { user, profile } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;
  const body = (await request.json()) as {
    status?: "draft" | "published" | "archived";
  };
  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const updated = await setTextPublishStatus(getDb(), slug, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Text not found" }, { status: 404 });
  }

  return NextResponse.json({ text: updated });
}
