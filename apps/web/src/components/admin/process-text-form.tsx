"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

type ProcessResult = {
  ok: true;
  slug: string;
  textId: string;
  sentenceCount: number;
  tokenCount: number;
  readerPath: string;
  tokensPath?: string;
  status?: string;
  created?: boolean;
};

type ProcessError = {
  error: string;
};

type ProcessTextFormProps = {
  existingSlugs: string[];
};

export function ProcessTextForm({ existingSlugs }: ProcessTextFormProps) {
  const [title, setTitle] = useState("Live demo");
  const [slug, setSlug] = useState("live-demo");
  const [level, setLevel] = useState<"N5" | "N4" | "N3">("N5");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [topic, setTopic] = useState("Daily life");
  const [isFree, setIsFree] = useState(true);
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [body, setBody] = useState(
    "今日は学校に行きました。友達と一緒に昼ご飯を食べました。",
  );
  const [reprocessSlug, setReprocessSlug] = useState(existingSlugs[0] ?? "");
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runProcess(payload: Record<string, unknown>) {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/texts/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as ProcessResult | ProcessError;
        if (!response.ok || "error" in data) {
          setError("error" in data ? data.error : "Request failed");
          return;
        }
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
      }
    });
  }

  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-2xl border border-line bg-white/80 p-6">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Process Japanese text
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Paste Japanese, tokenize with Kuromoji, match dictionary meanings,
          then save as draft or publish. Edit tokens after processing.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            runProcess({
              title,
              slug,
              level,
              body,
              status,
              topic,
              isFree,
              headerImageUrl: headerImageUrl.trim() || null,
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-muted">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">Slug</span>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-muted">Level</span>
              <select
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value as "N5" | "N4" | "N3")
                }
                className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
              >
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-ink-muted">Publish status</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "draft" | "published")
                }
                className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-muted">Topic / category</span>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
                placeholder="Daily life"
              />
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(event) => setIsFree(event.target.checked)}
                className="h-4 w-4 rounded border-line text-sakura-deep focus:ring-sakura-deep"
              />
              <span className="text-ink-muted">Free for all users</span>
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-ink-muted">Header image URL (optional)</span>
            <input
              value={headerImageUrl}
              onChange={(event) => setHeaderImageUrl(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
              placeholder="/texts/text-morning-routine.png or https://..."
            />
          </label>

          <label className="block text-sm">
            <span className="text-ink-muted">Japanese body</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={5}
              className="mt-1 w-full rounded-xl border border-line bg-paper/60 px-3 py-2 font-display text-lg leading-relaxed text-ink outline-none focus:border-sakura-deep"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-sakura-deep px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending
              ? "Processing…"
              : status === "draft"
                ? "Tokenize as draft"
                : "Tokenize & publish"}
          </button>
        </form>
      </div>

      {existingSlugs.length > 0 ? (
        <div className="rounded-2xl border border-line bg-white/80 p-6">
          <h3 className="text-lg font-semibold text-ink">
            Reprocess existing text
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Re-run Kuromoji + dictionary matching, or open the token editor.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="block text-sm">
              <span className="text-ink-muted">Slug</span>
              <select
                value={reprocessSlug}
                onChange={(event) => setReprocessSlug(event.target.value)}
                className="mt-1 block min-w-56 rounded-xl border border-line bg-paper/60 px-3 py-2 text-ink outline-none focus:border-sakura-deep"
              >
                {existingSlugs.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={isPending || !reprocessSlug}
              onClick={() =>
                runProcess({
                  slug: reprocessSlug,
                  reprocessExisting: true,
                })
              }
              className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-sakura-deep hover:text-sakura-deep disabled:opacity-60"
            >
              {isPending ? "Processing…" : "Reprocess"}
            </button>
            {reprocessSlug ? (
              <Link
                href={`/admin/texts/${reprocessSlug}/tokens`}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-sakura-deep"
              >
                Edit tokens
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p>
            Stored {result.sentenceCount} sentence
            {result.sentenceCount === 1 ? "" : "s"}, {result.tokenCount} token
            {result.tokenCount === 1 ? "" : "s"} for{" "}
            <code className="rounded bg-white/70 px-1.5 py-0.5">
              {result.slug}
            </code>
            {result.status ? ` (${result.status})` : ""}.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Link
              href={result.readerPath}
              className="font-medium text-sakura-deep hover:underline"
            >
              Open reader →
            </Link>
            {result.tokensPath ? (
              <Link
                href={result.tokensPath}
                className="font-medium text-sakura-deep hover:underline"
              >
                Correct tokens →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
