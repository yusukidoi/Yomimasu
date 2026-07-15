import type { AiExplanationPayload, JlptLevel } from "@yomimasu/shared";

export function buildDemoExplanation(input: {
  sentenceSurface: string;
  selectedTokenSurface?: string | null;
  previousSentence?: string | null;
  nextSentence?: string | null;
  userLevel: JlptLevel;
}): AiExplanationPayload {
  const focus = input.selectedTokenSurface?.trim() || null;
  const contextNote =
    input.previousSentence || input.nextSentence
      ? " Nearby sentences are used as light context in demo mode."
      : "";

  return {
    translation: `(Demo) Natural English sense of: ${input.sentenceSurface}`,
    breakdown: focus
      ? `At ${input.userLevel}, focus on 「${focus}」 in this sentence. It shapes the meaning together with the surrounding words.${contextNote} Set OPENAI_API_KEY for a full AI explanation.`
      : `At ${input.userLevel}, read this sentence for overall meaning first, then check individual words in the popup.${contextNote} Set OPENAI_API_KEY for a full AI explanation.`,
    tip: "Word popups use stored dictionary data. AI is only used for sentence-level explain.",
    focusToken: focus,
  };
}

export async function generateOpenAiExplanation(input: {
  sentenceSurface: string;
  selectedTokenSurface?: string | null;
  previousSentence?: string | null;
  nextSentence?: string | null;
  userLevel: JlptLevel;
  apiKey: string;
}): Promise<{ payload: AiExplanationPayload; model: string }> {
  const model = "gpt-4o-mini";
  const focus = input.selectedTokenSurface?.trim() || null;

  const contextLines = [
    input.previousSentence
      ? `Previous sentence: ${input.previousSentence}`
      : null,
    `Target sentence: ${input.sentenceSurface}`,
    input.nextSentence ? `Next sentence: ${input.nextSentence}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            `You are a concise Japanese tutor for English-speaking JLPT ${input.userLevel} learners.`,
            "Return JSON only with keys: translation (string), breakdown (string), tip (string).",
            "translation: natural English of the target sentence.",
            "breakdown: 2-4 short sentences on grammar and how the target sentence works.",
            "tip: one practical learning tip.",
            "Use previous/next sentences only as context; do not explain them in detail.",
            focus
              ? `Give a little extra attention to the word/particle 「${focus}」.`
              : "Explain the target sentence evenly.",
          ].join(" "),
        },
        {
          role: "user",
          content: contextLines,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI error (${response.status}): ${detail.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty explanation.");
  }

  const parsed = JSON.parse(content) as {
    translation?: string;
    breakdown?: string;
    tip?: string;
  };

  return {
    model,
    payload: {
      translation: parsed.translation?.trim() || "No translation returned.",
      breakdown: parsed.breakdown?.trim() || "No breakdown returned.",
      tip: parsed.tip?.trim() || "Re-read once while checking word popups.",
      focusToken: focus,
    },
  };
}
