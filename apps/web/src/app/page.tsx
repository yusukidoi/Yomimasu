import { listPublishedTexts, SAMPLE_TEXTS } from "@yomimasu/db";
import Link from "next/link";
import { LandingCategories } from "@/components/landing/landing-categories";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingProgressPreview } from "@/components/landing/landing-progress-preview";
import { SiteHeader } from "@/components/site-header";
import { tryGetDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type FreeTextCard = {
  id: string;
  slug: string;
  title: string;
  level: string;
  topic: string | null;
  summary: string | null;
  estimatedMinutes: number;
};

function fallbackFreeTexts(): FreeTextCard[] {
  return SAMPLE_TEXTS.map((text, index) => ({
    id: `fallback-${index}`,
    slug: text.slug,
    title: text.title,
    level: text.level,
    topic: text.topic,
    summary: text.summary,
    estimatedMinutes: text.estimatedMinutes,
  }));
}

async function loadFreeTexts(): Promise<FreeTextCard[]> {
  const db = tryGetDb();
  if (!db) return fallbackFreeTexts();

  try {
    const allPublished = await listPublishedTexts(db);
    const freeTexts = allPublished.filter((text) => text.isFree);
    if (freeTexts.length === 0) return fallbackFreeTexts();
    return freeTexts;
  } catch {
    return fallbackFreeTexts();
  }
}

export default async function Home() {
  const freeTexts = await loadFreeTexts();
  const startReadingHref = freeTexts[0]
    ? `/read/${freeTexts[0].slug}`
    : "/read/n5-morning-routine";

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,135,143,0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,135,143,0.18),transparent_70%)]"
      />

      <SiteHeader startReadingHref={startReadingHref} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-10">
        <LandingHero startReadingHref={startReadingHref} />

        <LandingFeatures />

        <section id="library" className="mt-24">
          <h2 className="font-display text-3xl font-semibold text-ink">Free texts</h2>
          <p className="mt-2 text-ink-muted">
            Start reading with no account.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {freeTexts.map((text) => (
              <Link
                key={text.id}
                href={`/read/${text.slug}`}
                className="rounded-2xl border border-line bg-white/80 p-5 transition hover:border-sakura/40"
              >
                <p className="text-sm font-medium text-sakura-deep">
                  {text.level}
                  {text.topic ? ` · ${text.topic}` : ""}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{text.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {text.summary ?? `${text.estimatedMinutes} min read`}
                </p>
                <p className="mt-4 text-sm font-medium text-ink">Read now →</p>
              </Link>
            ))}
          </div>
        </section>

        <LandingCategories />
        <LandingProgressPreview />
        <LandingCta startReadingHref={startReadingHref} />
      </main>
    </div>
  );
}
