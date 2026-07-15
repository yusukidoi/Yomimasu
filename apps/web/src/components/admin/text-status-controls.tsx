"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type TextStatusControlsProps = {
  slug: string;
  status: "draft" | "published" | "archived";
};

export function TextStatusControls({ slug, status }: TextStatusControlsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setStatus(next: "draft" | "published" | "archived") {
    if (next === status) return;
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/texts/${slug}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          setError(data.error ?? "Could not update status");
          return;
        }
        router.refresh();
      } catch {
        setError("Could not update status");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {status !== "published" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("published")}
            className="text-xs font-medium text-sakura-deep hover:underline disabled:opacity-60"
          >
            Publish
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("draft")}
            className="text-xs font-medium text-ink-muted hover:underline disabled:opacity-60"
          >
            Unpublish
          </button>
        )}
        {status !== "archived" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("archived")}
            className="text-xs font-medium text-ink-muted hover:underline disabled:opacity-60"
          >
            Archive
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStatus("draft")}
            className="text-xs font-medium text-ink-muted hover:underline disabled:opacity-60"
          >
            Restore draft
          </button>
        )}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
