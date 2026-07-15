"use client";

import type {
  AiExplanationPayload,
  ReaderSentence,
  ReaderText,
  ReaderToken,
} from "@yomimasu/shared";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TokenPopup } from "./token-popup";

type ReaderViewProps = {
  text: ReaderText;
  isLoggedIn: boolean;
};

function hasKanji(value: string) {
  return /[\u4E00-\u9FFF]/.test(value);
}

function TokenSpan({
  token,
  showFurigana,
  isSelected,
  onSelect,
}: {
  token: ReaderToken;
  showFurigana: boolean;
  isSelected: boolean;
  onSelect: (token: ReaderToken) => void;
}) {
  const clickable = token.kind !== "punctuation";

  if (!clickable) {
    return <span>{token.surface}</span>;
  }

  const content =
    showFurigana && token.reading && hasKanji(token.surface) ? (
      <ruby>
        {token.surface}
        <rt className="text-[0.45em] font-normal text-ink-muted">{token.reading}</rt>
      </ruby>
    ) : (
      token.surface
    );

  return (
    <button
      type="button"
      onClick={() => onSelect(token)}
      className={`relative mx-0.5 inline rounded px-0.5 transition ${
        isSelected
          ? "bg-[#fff3bf] text-ink"
          : "hover:bg-[#fff3bf]/70 hover:text-ink"
      }`}
    >
      {content}
    </button>
  );
}

export function ReaderView({ text, isLoggedIn }: ReaderViewProps) {
  const [showFurigana, setShowFurigana] = useState(true);
  const [selectedToken, setSelectedToken] = useState<ReaderToken | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<
    Record<
      string,
      {
        explanation: AiExplanationPayload;
        cached: boolean;
        source: string;
      }
    >
  >({});

  const totalTokens = useMemo(
    () => text.sentences.reduce((sum, sentence) => sum + sentence.tokens.length, 0),
    [text.sentences],
  );

  useEffect(() => {
    if (!isLoggedIn) return;

    function sendHeartbeat(secondsDelta: number, completed = false) {
      void fetch("/api/progress/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textId: text.id,
          secondsDelta,
          completed,
        }),
      });
    }

    sendHeartbeat(15);
    const interval = window.setInterval(() => sendHeartbeat(30), 30_000);

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        sendHeartbeat(10);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      sendHeartbeat(10);
    };
  }, [isLoggedIn, text.id]);

  async function explainSentence(sentence: ReaderSentence) {
    const focusInSentence = sentence.tokens.some(
      (token) => token.id === selectedToken?.id,
    )
      ? selectedToken?.surface
      : null;
    const sentenceIndex = text.sentences.findIndex((row) => row.id === sentence.id);
    const previousSentence =
      sentenceIndex > 0 ? text.sentences[sentenceIndex - 1]?.surface : null;
    const nextSentence =
      sentenceIndex >= 0 && sentenceIndex < text.sentences.length - 1
        ? text.sentences[sentenceIndex + 1]?.surface
        : null;

    setExplainingId(sentence.id);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textId: text.id,
          sentenceId: sentence.id,
          sentenceSurface: sentence.surface,
          selectedTokenSurface: focusInSentence,
          previousSentence,
          nextSentence,
          userLevel: text.level,
        }),
      });

      const data = (await response.json()) as {
        explanation?: AiExplanationPayload;
        cached?: boolean;
        source?: string;
        error?: string;
      };

      if (!response.ok || !data.explanation) {
        setStatusMessage(data.error ?? "Could not explain this sentence.");
        return;
      }

      setExplanations((current) => ({
        ...current,
        [sentence.id]: {
          explanation: data.explanation!,
          cached: Boolean(data.cached),
          source: data.source ?? "demo",
        },
      }));
    } catch {
      setStatusMessage("Could not explain this sentence.");
    } finally {
      setExplainingId(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 pb-12 pt-4">
      {text.headerImageUrl ? (
        <div className="mb-6 overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={text.headerImageUrl}
            alt=""
            className="max-h-64 w-full object-cover"
          />
        </div>
      ) : null}
      <header className="border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span className="rounded-full bg-sakura-deep/10 px-3 py-1 font-medium text-sakura-deep">
            {text.level}
          </span>
          {text.topic ? <span>{text.topic}</span> : null}
          {text.isFree ? <span>Free</span> : null}
          <span>{text.estimatedMinutes} min</span>
          <span>{text.wordCount} words</span>
          <span>{totalTokens} tokens</span>
        </div>
        <h1 className="font-display mt-4 text-4xl font-semibold text-ink">
          {text.title}
        </h1>
        {text.titleJa ? (
          <p className="mt-2 text-lg text-ink-muted">{text.titleJa}</p>
        ) : null}
        {text.summary ? (
          <p className="mt-4 max-w-2xl text-ink-muted">{text.summary}</p>
        ) : null}
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm">
        <p className="text-ink-muted">
          Click any word for instant help, or Explain for the whole sentence.
        </p>
        <label className="flex items-center gap-2 font-medium text-ink">
          <input
            type="checkbox"
            checked={showFurigana}
            onChange={(event) => setShowFurigana(event.target.checked)}
            className="h-4 w-4 rounded border-line text-sakura-deep focus:ring-sakura-deep"
          />
          Furigana
        </label>
      </div>

      {statusMessage ? (
        <p className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink-muted">
          {statusMessage}
        </p>
      ) : null}

      <article className="relative mt-8 space-y-8">
        {text.sentences.map((sentence) => {
          const result = explanations[sentence.id];
          return (
            <div key={sentence.id} className="space-y-3">
              <div className="font-display text-2xl leading-[2.1] text-ink md:text-[1.7rem]">
                {sentence.tokens.map((token) => (
                  <span key={token.id} className="relative inline">
                    <TokenSpan
                      token={token}
                      showFurigana={showFurigana}
                      isSelected={selectedToken?.id === token.id}
                      onSelect={setSelectedToken}
                    />
                    {selectedToken?.id === token.id ? (
                      <TokenPopup
                        token={token}
                        isLoggedIn={isLoggedIn}
                        onClose={() => setSelectedToken(null)}
                        onSaved={setStatusMessage}
                      />
                    ) : null}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void explainSentence(sentence)}
                  disabled={explainingId === sentence.id}
                  className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-paper disabled:opacity-60"
                >
                  {explainingId === sentence.id ? "Explaining…" : "Explain"}
                </button>
                {result ? (
                  <span className="text-xs text-ink-muted">
                    {result.cached ? "Cached" : "Fresh"} · {result.source}
                  </span>
                ) : null}
              </div>

              {result ? (
                <div className="rounded-2xl border border-line bg-white/85 px-4 py-4 text-sm leading-relaxed text-ink-muted">
                  <p className="font-medium text-ink">{result.explanation.translation}</p>
                  <p className="mt-3">{result.explanation.breakdown}</p>
                  <p className="mt-3 text-xs">{result.explanation.tip}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </article>

      {text.translationEn ? (
        <section className="mt-12 rounded-2xl border border-line bg-white/80 p-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-ink-muted">
            English translation
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
            {text.translationEn
              .split(/\n+/)
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, index) => (
                <p key={`${text.slug}-en-${index}`}>{line}</p>
              ))}
          </div>
        </section>
      ) : null}

      {!isLoggedIn ? (
        <p className="mt-8 text-sm text-ink-muted">
          <Link href="/login" className="font-medium text-sakura-deep hover:underline">
            Log in
          </Link>{" "}
          to save words and track progress.
        </p>
      ) : null}
    </main>
  );
}
