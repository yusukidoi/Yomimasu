import {
  findCachedExplanation,
  recordAiUsageEvent,
  storeExplanation,
} from "@yomimasu/db";
import type { AiExplanationPayload, JlptLevel } from "@yomimasu/shared";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { getDb, tryGetDb } from "@/lib/db";
import {
  buildDemoExplanation,
  generateOpenAiExplanation,
} from "@/lib/explain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExplainBody = {
  textId?: string;
  sentenceId?: string;
  sentenceSurface?: string;
  selectedTokenSurface?: string | null;
  previousSentence?: string | null;
  nextSentence?: string | null;
  userLevel?: JlptLevel;
};

function isJlptLevel(value: unknown): value is JlptLevel {
  return value === "N5" || value === "N4" || value === "N3";
}

export async function POST(request: Request) {
  const body = (await request.json()) as ExplainBody;
  const sentenceSurface = body.sentenceSurface?.trim();
  if (!sentenceSurface) {
    return NextResponse.json(
      { error: "sentenceSurface is required" },
      { status: 400 },
    );
  }

  const { user, profile } = await getSessionProfile();
  const userLevel: JlptLevel = isJlptLevel(body.userLevel)
    ? body.userLevel
    : isJlptLevel(profile?.jlptLevel)
      ? profile.jlptLevel
      : "N5";

  const db = tryGetDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 503 },
    );
  }

  const cached = await findCachedExplanation(db, {
    sentenceSurface,
    selectedTokenSurface: body.selectedTokenSurface,
    userLevel,
  });

  if (cached) {
    if (user) {
      await recordAiUsageEvent(db, {
        userId: user.id,
        textId: body.textId ?? null,
        sentenceId: body.sentenceId ?? null,
        cached: true,
        model: cached.model,
      });
    }
    return NextResponse.json({
      explanation: cached.response as AiExplanationPayload,
      cached: true,
      model: cached.model,
      source: cached.model?.startsWith("demo") ? "demo" : "openai",
    });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  let payload: AiExplanationPayload;
  let model: string;
  let source: "openai" | "demo";

  if (apiKey) {
    try {
      const generated = await generateOpenAiExplanation({
        sentenceSurface,
        selectedTokenSurface: body.selectedTokenSurface,
        previousSentence: body.previousSentence,
        nextSentence: body.nextSentence,
        userLevel,
        apiKey,
      });
      payload = generated.payload;
      model = generated.model;
      source = "openai";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OpenAI request failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  } else {
    payload = buildDemoExplanation({
      sentenceSurface,
      selectedTokenSurface: body.selectedTokenSurface,
      previousSentence: body.previousSentence,
      nextSentence: body.nextSentence,
      userLevel,
    });
    model = "demo-local";
    source = "demo";
  }

  const stored = await storeExplanation(getDb(), {
    textId: body.textId ?? null,
    sentenceId: body.sentenceId ?? null,
    sentenceSurface,
    selectedTokenSurface: body.selectedTokenSurface,
    userLevel,
    response: payload,
    model,
  });

  if (user) {
    await recordAiUsageEvent(db, {
      userId: user.id,
      textId: body.textId ?? null,
      sentenceId: body.sentenceId ?? null,
      cached: false,
      model: stored.model,
    });
  }

  return NextResponse.json({
    explanation: stored.response as AiExplanationPayload,
    cached: false,
    model: stored.model,
    source,
    userId: user?.id ?? null,
  });
}
