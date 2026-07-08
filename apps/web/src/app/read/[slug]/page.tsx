import { getTextBySlug } from "@yomimasu/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

type ReaderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;
  const text = await getTextBySlug(getDb(), slug);

  if (!text || text.status !== "published") {
    notFound();
  }

  const paragraphs = text.body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

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

      <article className="mt-8 space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${slug}-${index}`}
            className="font-display text-2xl leading-[1.9] text-ink md:text-[1.7rem]"
          >
            {paragraph}
          </p>
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
                <p key={`${slug}-en-${index}`}>{line}</p>
              ))}
          </div>
        </section>
      ) : null}

      <p className="mt-10 text-sm text-ink-muted">
        Clickable words and furigana come in the next step.
      </p>
    </main>
  );
}
