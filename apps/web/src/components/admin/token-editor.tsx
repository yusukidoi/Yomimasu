"use client";

import { useState, useTransition } from "react";

export type EditableToken = {
  id: string;
  index: number;
  surface: string;
  lemma: string | null;
  reading: string | null;
  meaning: string | null;
  meaningOverride: string | null;
  partOfSpeech: string | null;
  kind: string;
  grammarForm: string | null;
};

type TokenEditorProps = {
  slug: string;
  initialTokens: EditableToken[];
};

export function TokenEditor({ slug, initialTokens }: TokenEditorProps) {
  const [tokens, setTokens] = useState(initialTokens);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateLocal(id: string, patch: Partial<EditableToken>) {
    setTokens((prev) =>
      prev.map((token) => (token.id === id ? { ...token, ...patch } : token)),
    );
  }

  function saveToken(token: EditableToken) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/tokens/${token.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meaningOverride: token.meaningOverride,
            meaning: token.meaning,
            reading: token.reading,
            lemma: token.lemma,
            grammarForm: token.grammarForm,
          }),
        });
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Save failed");
          return;
        }
        setMessage(`Saved token #${token.index} (${token.surface})`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm text-ink-muted">
        Correct meanings/readings for <code>{slug}</code>. Reader prefers{" "}
        <strong>meaning override</strong> when set.
      </p>

      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-white/80">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line bg-paper/80 text-ink-muted">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Surface</th>
              <th className="px-3 py-2">Reading</th>
              <th className="px-3 py-2">Lemma</th>
              <th className="px-3 py-2">Meaning</th>
              <th className="px-3 py-2">Override</th>
              <th className="px-3 py-2">POS</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tokens.map((token) => (
              <tr key={token.id}>
                <td className="px-3 py-2 text-ink-muted">{token.index}</td>
                <td className="px-3 py-2 font-medium text-ink">{token.surface}</td>
                <td className="px-3 py-2">
                  <input
                    value={token.reading ?? ""}
                    onChange={(event) =>
                      updateLocal(token.id, {
                        reading: event.target.value || null,
                      })
                    }
                    className="w-28 rounded border border-line bg-paper/60 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={token.lemma ?? ""}
                    onChange={(event) =>
                      updateLocal(token.id, {
                        lemma: event.target.value || null,
                      })
                    }
                    className="w-28 rounded border border-line bg-paper/60 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={token.meaning ?? ""}
                    onChange={(event) =>
                      updateLocal(token.id, {
                        meaning: event.target.value || null,
                      })
                    }
                    className="w-36 rounded border border-line bg-paper/60 px-2 py-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={token.meaningOverride ?? ""}
                    onChange={(event) =>
                      updateLocal(token.id, {
                        meaningOverride: event.target.value || null,
                      })
                    }
                    className="w-36 rounded border border-line bg-paper/60 px-2 py-1"
                    placeholder="override"
                  />
                </td>
                <td className="max-w-[120px] truncate px-3 py-2 text-xs text-ink-muted">
                  {token.partOfSpeech}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => saveToken(token)}
                    className="rounded-full bg-sakura-deep px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
