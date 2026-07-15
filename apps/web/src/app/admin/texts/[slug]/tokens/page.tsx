import { listTokensForTextSlug } from "@yomimasu/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TokenEditor } from "@/components/admin/token-editor";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminTokensPage({ params }: PageProps) {
  await requireAdmin("/admin");
  const { slug } = await params;
  const data = await listTokensForTextSlug(getDb(), slug);
  if (!data) notFound();

  const { text, tokens } = data;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Admin · Tokens
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
            {text.title}
          </h1>
          <p className="mt-2 text-ink-muted">
            {text.slug} · {tokens.length} tokens · {text.status}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-full border border-line bg-white/80 px-4 py-2 text-ink-muted"
          >
            ← Texts
          </Link>
          <Link
            href={`/read/${text.slug}`}
            className="rounded-full bg-sakura-deep px-4 py-2 font-medium text-white"
          >
            Open reader
          </Link>
        </div>
      </div>

      <TokenEditor
        slug={text.slug}
        initialTokens={tokens.map((token) => ({
          id: token.id,
          index: token.index,
          surface: token.surface,
          lemma: token.lemma,
          reading: token.reading,
          meaning: token.meaning,
          meaningOverride: token.meaningOverride,
          partOfSpeech: token.partOfSpeech,
          kind: token.kind,
          grammarForm: token.grammarForm,
        }))}
      />
    </main>
  );
}
