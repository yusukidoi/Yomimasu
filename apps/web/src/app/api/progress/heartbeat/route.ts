import { recordReadingHeartbeat } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type HeartbeatBody = {
  textId?: string;
  secondsDelta?: number;
  completed?: boolean;
  lastParagraphIndex?: number;
};

export async function POST(request: Request) {
  const { user } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HeartbeatBody;
  if (!body.textId) {
    return NextResponse.json({ error: "textId is required" }, { status: 400 });
  }

  const session = await recordReadingHeartbeat(getDb(), {
    userId: user.id,
    textId: body.textId,
    secondsDelta: body.secondsDelta,
    completed: body.completed,
    lastParagraphIndex: body.lastParagraphIndex,
  });

  return NextResponse.json({ session });
}
