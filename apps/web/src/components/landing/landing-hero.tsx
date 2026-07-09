import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FireIcon,
  GridIcon,
  ListIcon,
  SettingsIcon,
  SparklesIcon,
  StarIcon,
  TextSizeIcon,
} from "./landing-icons";

type Segment = { b: string; r?: string; hl?: boolean };

const READER_LINES: Segment[][] = [
  [
    { b: "日曜日", r: "にちようび" },
    { b: "、" },
    { b: "私", r: "わたし" },
    { b: "は" },
    { b: "友", r: "とも" },
    { b: "だちと" },
    { b: "公園", r: "こうえん" },
    { b: "へ" },
    { b: "行", r: "い" },
    { b: "きました。" },
  ],
  [
    { b: "天気", r: "てんき" },
    { b: "がよかったので、みんなでお" },
    { b: "弁当", r: "べんとう" },
    { b: "を" },
  ],
  [
    { b: "持", r: "も" },
    { b: "って" },
    { b: "行", r: "い" },
    { b: "きました。" },
    { b: "木", r: "き" },
    { b: "の" },
    { b: "下", r: "した" },
    { b: "にシートを" },
  ],
  [
    { b: "敷", r: "し" },
    { b: "いて、いろいろな" },
    { b: "話", r: "はなし" },
    { b: "をしながら、" },
  ],
  [
    { b: "おいしい" },
    { b: "昼", r: "ひる" },
    { b: "ごはんを " },
    { b: "食", r: "た", hl: true },
    { b: "べました。", hl: true },
  ],
  [
    { b: "食", r: "た" },
    { b: "べたあと、" },
    { b: "近", r: "ちか" },
    { b: "くの" },
    { b: "川", r: "かわ" },
    { b: "を" },
    { b: "散歩", r: "さんぽ" },
    { b: "しました。" },
  ],
  [
    { b: "とても" },
    { b: "楽", r: "たの" },
    { b: "しい" },
    { b: "一日", r: "いちにち" },
    { b: "でした。" },
  ],
];

function ReaderText() {
  return (
    <p className="font-display text-[1.35rem] leading-[2.4] text-ink">
      {READER_LINES.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map((seg, segIndex) =>
            seg.r ? (
              <ruby
                key={segIndex}
                className={
                  seg.hl ? "rounded bg-[#fff3bf] px-0.5" : undefined
                }
              >
                {seg.b}
                <rt className="text-[0.42em] font-normal text-ink-muted">
                  {seg.r}
                </rt>
              </ruby>
            ) : (
              <span
                key={segIndex}
                className={seg.hl ? "rounded bg-[#fff3bf] px-0.5" : undefined}
              >
                {seg.b}
              </span>
            ),
          )}
        </span>
      ))}
    </p>
  );
}

function WordPopup() {
  return (
    <div className="w-60 rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_rgba(43,38,36,0.16)]">
      <p className="font-display text-2xl font-semibold text-ink">食べました</p>
      <p className="mt-0.5 text-xs text-ink-muted">たべました</p>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Reading</dt>
          <dd className="text-ink">tabemashita</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Meaning</dt>
          <dd className="text-ink">ate</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Base form</dt>
          <dd className="text-ink">食べる</dd>
        </div>
      </dl>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper"
      >
        <BookmarkIcon className="h-4 w-4" />
        Save word
      </button>
      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2 text-sm font-medium text-white transition hover:bg-[#3a3330]"
      >
        <SparklesIcon className="h-4 w-4" />
        Explain
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-white/90 px-4 py-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-2xl font-semibold text-ink">{value}</span>
        {icon}
      </div>
    </div>
  );
}

type LandingHeroProps = {
  startReadingHref: string;
};

export function LandingHero({ startReadingHref }: LandingHeroProps) {
  return (
    <section className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
      <Image
        src="/decorations/sakura-corner.png"
        alt=""
        aria-hidden
        width={260}
        height={260}
        priority
        className="pointer-events-none absolute -left-16 -top-24 hidden w-56 select-none mix-blend-multiply lg:block"
      />

      <div className="animate-fade-up">
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
          Master Japanese reading{" "}
          <span className="text-sakura-deep">at your level.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
          Reading is one of the most powerful tools for vocabulary, grammar, and
          comprehension&mdash;especially in Japanese. Yomimasu makes it easy with
          instant support every step of the way.
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
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            <GridIcon className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Link
            href="/#library"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3 text-sm font-medium text-ink transition hover:bg-white"
          >
            <BookIcon className="h-4 w-4" />
            Browse Library
          </Link>
          <Link
            href={startReadingHref}
            className="inline-flex items-center gap-1.5 px-2 text-sm font-medium text-ink-muted transition hover:text-ink"
          >
            Try Demo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[
              "from-[#f3c1c6] to-[#e8878f]",
              "from-[#f0d6b8] to-[#d4a15a]",
              "from-[#c9d9c1] to-[#8aae7e]",
              "from-[#c8d2e8] to-[#8a9ec8]",
            ].map((gradient, index) => (
              <span
                key={index}
                className={`h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br ${gradient}`}
                aria-hidden
              />
            ))}
          </div>
          <div>
            <div className="flex text-sakura-deep">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              Loved by learners worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-up-delay">
        <div className="relative">
          <div className="rounded-3xl border border-line bg-white/90 p-5 shadow-[0_28px_70px_rgba(43,38,36,0.10)] backdrop-blur md:p-6">
            <div className="flex items-center justify-between text-ink-muted">
              <div className="flex items-center gap-3">
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="text-sm text-ink">春のピクニック</span>
              </div>
              <div className="flex items-center gap-3">
                <BookmarkIcon className="h-5 w-5" />
                <ListIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5">
              <ReaderText />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-ink-muted">
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-sm">1 / 6</span>
              <ChevronRightIcon className="h-5 w-5" />
              <div className="flex items-center gap-3">
                <TextSizeIcon className="h-5 w-5" />
                <SettingsIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-16 hidden md:block">
            <WordPopup />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <StatCard
            label="Known words"
            value="423"
            icon={
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e7f4ea] text-[11px] text-[#3f8a52]">
                ✓
              </span>
            }
          />
          <StatCard
            label="New words"
            value="18"
            icon={<span className="h-3 w-3 rounded-full bg-[#8b7ec8]" />}
          />
          <StatCard
            label="Reading streak"
            value="8 days"
            icon={<FireIcon className="h-5 w-5 text-sakura-deep" />}
          />
        </div>
      </div>
    </section>
  );
}
