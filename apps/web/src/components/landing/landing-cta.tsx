import Link from "next/link";

type LandingCtaProps = {
  startReadingHref: string;
};

export function LandingCta({ startReadingHref }: LandingCtaProps) {
  return (
    <section className="relative mt-24 overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-r from-[#fff5f6] via-[#faf7f4] to-[#f3ebe3] px-6 py-14 md:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-4 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,135,143,0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(200,140,90,0.22),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Start building real Japanese today.
        </h2>
        <p className="mt-3 text-ink-muted">
          Jump in, explore stories, and enjoy the journey.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={startReadingHref}
            className="rounded-full bg-sakura-deep px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b34d58]"
          >
            Start Reading →
          </Link>
          <Link
            href="/app"
            className="rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/#library"
            className="rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            Browse Library
          </Link>
        </div>
      </div>
    </section>
  );
}
