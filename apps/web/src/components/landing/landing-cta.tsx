import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, BookIcon, GridIcon } from "./landing-icons";

type LandingCtaProps = {
  startReadingHref: string;
};

export function LandingCta({ startReadingHref }: LandingCtaProps) {
  return (
    <section className="relative mt-24 flex min-h-[280px] items-center overflow-hidden rounded-[1.75rem] border border-line bg-[#fff5f6] px-6 py-14 md:px-12">
      <Image
        src="/decorations/cta-banner.png"
        alt=""
        aria-hidden
        fill
        priority={false}
        sizes="(max-width: 1152px) 100vw, 1152px"
        className="pointer-events-none select-none object-cover object-right"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fff5f6] via-[#fff5f6]/70 to-transparent"
      />

      <div className="relative max-w-2xl">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Start building real Japanese today.
        </h2>
        <p className="mt-3 text-ink-muted">
          Jump in, explore stories, and enjoy the journey.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={startReadingHref}
            className="inline-flex items-center gap-2 rounded-full bg-sakura-deep px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b34d58]"
          >
            Start Reading
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            <GridIcon className="h-4 w-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/#library"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            <BookIcon className="h-4 w-4" />
            Browse Library
          </Link>
        </div>
      </div>
    </section>
  );
}
