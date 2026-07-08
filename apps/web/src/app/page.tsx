import Link from "next/link";

export default function Home() {
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

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-xl text-sakura" aria-hidden>
            ✿
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Yomimasu
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          <Link href="#features">Features</Link>
          <Link href="#library">Library</Link>
          <Link href="/app">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-ink-muted hover:text-ink">
            Log in
          </Link>
          <Link
            href="/read/n5-morning-routine"
            className="rounded-full bg-sakura-deep px-4 py-2 font-medium text-white transition hover:bg-[#b34d58]"
          >
            Start Reading
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-10">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-up">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-sakura-deep">
              Japanese graded reader
            </p>
            <h1 className="font-display max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Yomimasu
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
              Master Japanese reading at your level. Click words for instant readings,
              meanings, and grammar help while you read.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/read/n5-morning-routine"
                className="rounded-full bg-sakura-deep px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b34d58]"
              >
                Start Reading →
              </Link>
              <Link
                href="/app"
                className="rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay rounded-3xl border border-line bg-white/80 p-6 shadow-[0_24px_60px_rgba(43,38,36,0.08)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between text-sm text-ink-muted">
              <span>Spring Picnic · N4</span>
              <span>1 / 6</span>
            </div>
            <p className="font-display text-2xl leading-relaxed text-ink">
              私は<span className="rounded bg-[#fff3bf] px-1">友達</span>と公園へ行きました。
            </p>
            <div className="mt-5 rounded-2xl border border-line bg-paper p-4 text-sm">
              <p className="font-medium text-ink">友達</p>
              <p className="text-ink-muted">ともだち · friend</p>
              <p className="mt-2 text-ink-muted">Base: 友達 · noun</p>
            </div>
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-4 md:grid-cols-3">
          {[
            "Clickable words with instant dictionary popups",
            "Optional furigana for every kanji",
            "Save vocabulary and track reading progress",
          ].map((feature) => (
            <article
              key={feature}
              className="rounded-2xl border border-line bg-white/70 p-5 text-sm leading-relaxed text-ink-muted"
            >
              {feature}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
