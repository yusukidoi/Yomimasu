"use client";

import type { ReaderToken } from "@yomimasu/shared";
import { useEffect, useRef } from "react";

type TokenPopupProps = {
  token: ReaderToken;
  isLoggedIn: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
};

export function TokenPopup({
  token,
  isLoggedIn,
  onClose,
  onSaved,
}: TokenPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!popupRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  async function saveWord(status: "saved" | "known") {
    if (!isLoggedIn) {
      onSaved("Log in to save vocabulary.");
      return;
    }

    const response = await fetch("/api/vocabulary/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surface: token.surface,
        lemma: token.lemma,
        reading: token.reading,
        meaning: token.meaning,
        status,
      }),
    });

    if (!response.ok) {
      onSaved("Could not save word. Please try again.");
      return;
    }

    onSaved(status === "known" ? "Marked as known." : "Word saved.");
  }

  return (
    <div
      ref={popupRef}
      className="absolute left-0 top-full z-20 mt-3 w-72 rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_rgba(43,38,36,0.12)]"
    >
      <p className="font-display text-2xl font-semibold text-ink">{token.surface}</p>
      {token.reading ? (
        <p className="mt-1 text-sm text-ink-muted">{token.reading}</p>
      ) : null}
      {token.lemma ? (
        <p className="mt-3 text-sm text-ink">
          Base: <span className="font-medium">{token.lemma}</span>
        </p>
      ) : null}
      {token.meaning ? (
        <p className="mt-1 text-sm text-ink-muted">Meaning: {token.meaning}</p>
      ) : null}
      {token.partOfSpeech ? (
        <p className="mt-1 text-sm text-ink-muted">
          {token.partOfSpeech}
          {token.grammarForm ? ` · ${token.grammarForm}` : ""}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => saveWord("saved")}
          className="rounded-full bg-sakura-deep px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#b34d58]"
        >
          Save word
        </button>
        <button
          type="button"
          onClick={() => saveWord("known")}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-paper"
        >
          Mark as known
        </button>
      </div>
    </div>
  );
}
