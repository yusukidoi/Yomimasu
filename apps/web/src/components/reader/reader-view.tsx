"use client";

import type { ReaderText, ReaderToken } from "@yomimasu/shared";
import Link from "next/link";
import { useMemo, useState } from "react";
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

  const totalTokens = useMemo(
    () => text.sentences.reduce((sum, sentence) => sum + sentence.tokens.length, 0),
    [text.sentences],
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="text-sm text-ink-muted hover:text-ink">
          ← Home
        </Link>
        <Link href="/app" className="text-sm text-ink-muted hover:text-ink">
          Dashboard
        </Link>
      </div>

      <header className="mt-10 border-b border-line pb-6">
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
        <p className="text-ink-muted">Click any word or particle for instant help.</p>
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

      <article className="relative mt-8 space-y-6">
        {text.sentences.map((sentence) => (
          <div
            key={sentence.id}
            className="font-display text-2xl leading-[2.1] text-ink md:text-[1.7rem]"
          >
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
        ))}
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
