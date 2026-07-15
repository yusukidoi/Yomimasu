import { processTextBySlug, upsertAndProcessText } from "@yomimasu/db";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionProfile } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProcessBody = {
  slug?: string;
  title?: string;
  body?: string;
  level?: "N5" | "N4" | "N3";
  status?: "draft" | "published";
  reprocessExisting?: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const { user, profile } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!profile?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const input = (await request.json()) as ProcessBody;
  const db = getDb();

  if (input.reprocessExisting && input.slug) {
    try {
      const result = await processTextBySlug(db, input.slug);
      return NextResponse.json({
        ok: true,
        slug: input.slug,
        textId: result.textId,
        sentenceCount: result.sentenceCount,
        tokenCount: result.tokenCount,
        readerPath: `/read/${input.slug}`,
        tokensPath: `/admin/texts/${input.slug}/tokens`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reprocess text";
      const status = message.includes("not found") ? 404 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  const body = input.body?.trim();
  if (!body) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const title = input.title?.trim() || "Untitled text";
  const slug =
    input.slug?.trim() ||
    slugify(title) ||
    `text-${Date.now().toString(36)}`;

  try {
    const result = await upsertAndProcessText(db, {
      slug,
      title,
      body,
      level: input.level ?? "N5",
      isFree: true,
      status: input.status ?? "published",
    });

    return NextResponse.json({
      ok: true,
      slug: result.slug,
      textId: result.textId,
      created: result.created,
      status: result.status,
      sentenceCount: result.sentenceCount,
      tokenCount: result.tokenCount,
      readerPath: `/read/${result.slug}`,
      tokensPath: `/admin/texts/${result.slug}/tokens`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process text";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
