import {
  getProgressSummary,
  listPublishedTexts,
  SAMPLE_TEXTS,
} from "@yomimasu/db";
import { LandingCategories } from "@/components/landing/landing-categories";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFreeTexts } from "@/components/landing/landing-free-texts";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingProgressPreview } from "@/components/landing/landing-progress-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { tryGetDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type FreeTextCard = {
  id: string;
  slug: string;
  title: string;
  titleJa: string | null;
  level: string;
  topic: string | null;
  summary: string | null;
  estimatedMinutes: number;
  headerImageUrl: string | null;
};

function fallbackFreeTexts(): FreeTextCard[] {
  return SAMPLE_TEXTS.map((text, index) => ({
    id: `fallback-${index}`,
    slug: text.slug,
    title: text.title,
    titleJa: text.titleJa,
    level: text.level,
    topic: text.topic,
    summary: text.summary,
    estimatedMinutes: text.estimatedMinutes,
    headerImageUrl: null,
  }));
}

async function loadFreeTexts(): Promise<FreeTextCard[]> {
  const db = tryGetDb();
  if (!db) return fallbackFreeTexts();

  try {
    const allPublished = await listPublishedTexts(db);
    const freeTexts = allPublished.filter((text) => text.isFree);
    if (freeTexts.length === 0) return fallbackFreeTexts();
    return freeTexts.map((text) => ({
      id: text.id,
      slug: text.slug,
      title: text.title,
      titleJa: text.titleJa,
      level: text.level,
      topic: text.topic,
      summary: text.summary,
      estimatedMinutes: text.estimatedMinutes,
      headerImageUrl: text.headerImageUrl,
    }));
  } catch {
    return fallbackFreeTexts();
  }
}

export default async function Home() {
  const freeTexts = await loadFreeTexts();
  const startReadingHref = freeTexts[0]
    ? `/read/${freeTexts[0].slug}`
    : "/read/n5-morning-routine";

  const { user } = await getSessionProfile();
  const db = tryGetDb();
  let liveProgress = null;
  if (user && db) {
    try {
      liveProgress = await getProgressSummary(db, user.id);
    } catch {
      liveProgress = null;
    }
  }

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

        <LandingFreeTexts texts={freeTexts} />

        <LandingCategories />
        <LandingProgressPreview
          progress={liveProgress}
          isLive={Boolean(liveProgress)}
        />
        <LandingCta startReadingHref={startReadingHref} />
      </main>

      <SiteFooter />
    </div>
  );
}
