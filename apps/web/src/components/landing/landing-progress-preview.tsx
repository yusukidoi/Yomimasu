"use client";

import Link from "next/link";

/**
 * Progress charts: demo numbers for guests; live `progress`/`isLive` from
 * reading_sessions + user_vocabulary when the user is logged in.
 */
export const DEMO_PROGRESS = {
  knownWords: 423,
  newWords: 18,
  readingTime: "5h 24m",
  streakDays: 8,
  level: {
    current: "N5",
    next: "N4",
    goal: "N3",
    percent: 76,
  },
  weeklyReading: [
    { day: "Mon", percent: 35 },
    { day: "Tue", percent: 48 },
    { day: "Wed", percent: 42 },
    { day: "Thu", percent: 58 },
    { day: "Fri", percent: 72 },
    { day: "Sat", percent: 80 },
    { day: "Sun", percent: 88 },
  ],
  vocabulary: {
    known: 423,
    knownPercent: 76,
    new: 103,
    newPercent: 17,
    review: 32,
    reviewPercent: 7,
  },
} as const;

function ReadingLineChart({
  points,
}: {
  points: ReadonlyArray<{ day: string; percent: number }>;
}) {
  const width = 320;
  const height = 140;
  const padding = 16;
  const maxY = 100;

  const coords = points.map((point, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const y = height - padding - (point.percent / maxY) * (height - padding * 2);
    return { ...point, x, y };
  });

  const path = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full" role="img">
      <title>Weekly reading progress</title>
      {[0, 50, 100].map((tick) => {
        const y = height - padding - (tick / maxY) * (height - padding * 2);
        return (
          <g key={tick}>
            <line
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#eadfd8"
              strokeDasharray="4 4"
            />
            <text x={4} y={y + 3} className="fill-ink-muted text-[9px]">
              {tick}%
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="#5f9e6e" strokeWidth="2.5" />
      {coords.map((point) => (
        <g key={point.day}>
          <circle cx={point.x} cy={point.y} r="4" fill="#5f9e6e" />
          <text
            x={point.x}
            y={height - 2}
            textAnchor="middle"
            className="fill-ink-muted text-[9px]"
          >
            {point.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

function VocabularyDonut({
  knownPercent,
  newPercent,
  reviewPercent,
}: {
  knownPercent: number;
  newPercent: number;
  reviewPercent: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const knownLen = (knownPercent / 100) * circumference;
  const newLen = (newPercent / 100) * circumference;
  const reviewLen = (reviewPercent / 100) * circumference;

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" role="img">
      <title>Vocabulary status</title>
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#eadfd8"
        strokeWidth="14"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#5f9e6e"
        strokeWidth="14"
        strokeDasharray={`${knownLen} ${circumference - knownLen}`}
        strokeDashoffset={circumference * 0.25}
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#8b7ec8"
        strokeWidth="14"
        strokeDasharray={`${newLen} ${circumference - newLen}`}
        strokeDashoffset={circumference * 0.25 - knownLen}
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#d4895a"
        strokeWidth="14"
        strokeDasharray={`${reviewLen} ${circumference - reviewLen}`}
        strokeDashoffset={circumference * 0.25 - knownLen - newLen}
        transform="rotate(-90 60 60)"
      />
    </svg>
  );
}

export type ProgressChartData = {
  knownWords: number;
  newWords: number;
  readingTime: string;
  streakDays: number;
  level: {
    current: string;
    next: string;
    goal: string;
    percent: number;
  };
  weeklyReading: ReadonlyArray<{ day: string; percent: number }>;
  vocabulary: {
    known: number;
    knownPercent: number;
    new: number;
    newPercent: number;
    review: number;
    reviewPercent: number;
  };
};

type LandingProgressPreviewProps = {
  progress?: ProgressChartData | null;
  isLive?: boolean;
};

export function LandingProgressPreview({
  progress,
  isLive = false,
}: LandingProgressPreviewProps) {
  const data = progress ?? DEMO_PROGRESS;

  return (
    <section id="progress" className="mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            See your Japanese level grow.
          </h2>
          <p className="mt-2 text-ink-muted">
            {isLive
              ? "Live from your reading sessions and vocabulary."
              : "Stay motivated with clear insights."}
          </p>
        </div>
        <Link
          href="/app"
          className="text-sm font-medium text-sakura-deep transition hover:text-[#b34d58]"
        >
          Go to Dashboard →
        </Link>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-line bg-white/85 p-5 shadow-[0_24px_60px_rgba(43,38,36,0.06)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.2fr_0.95fr]">
          <ul className="space-y-5">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f4ea] text-sm text-[#3f8a52]">
                ✓
              </span>
              <div>
                <p className="text-sm text-ink-muted">Known words</p>
                <p className="text-2xl font-semibold text-ink">{data.knownWords}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ece8f8] text-sm text-[#6f5fb0]">
                ◉
              </span>
              <div>
                <p className="text-sm text-ink-muted">New words</p>
                <p className="text-2xl font-semibold text-ink">{data.newWords}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ebe0] text-sm text-[#c47a45]">
                ◷
              </span>
              <div>
                <p className="text-sm text-ink-muted">Reading time</p>
                <p className="text-2xl font-semibold text-ink">{data.readingTime}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8e4e6] text-sm text-sakura-deep">
                ✦
              </span>
              <div>
                <p className="text-sm text-ink-muted">Reading streak</p>
                <p className="text-2xl font-semibold text-ink">{data.streakDays} days</p>
              </div>
            </li>
          </ul>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-ink">Level progress</p>
              <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                <div className="text-center">
                  <span className="inline-block rounded-lg bg-[#e7f4ea] px-3 py-1.5 font-semibold text-[#3f8a52]">
                    {data.level.current}
                  </span>
                  <p className="mt-1 text-xs text-ink-muted">You&apos;re here</p>
                </div>
                <span className="text-ink-muted">→</span>
                <div className="text-center">
                  <span className="inline-block rounded-lg border border-line px-3 py-1.5 font-semibold text-ink">
                    {data.level.next}
                  </span>
                  <p className="mt-1 text-xs text-ink-muted">Next goal</p>
                </div>
                <span className="text-ink-muted">→</span>
                <div className="text-center">
                  <span className="inline-block rounded-lg border border-line px-3 py-1.5 text-ink-muted">
                    {data.level.goal}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-[#5f9e6e]"
                    style={{ width: `${data.level.percent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-ink">{data.level.percent}%</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-ink">Reading progress</p>
              <div className="mt-2">
                <ReadingLineChart points={data.weeklyReading} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Vocabulary status</p>
            <div className="mt-4 flex items-center gap-4">
              <VocabularyDonut
                knownPercent={data.vocabulary.knownPercent}
                newPercent={data.vocabulary.newPercent}
                reviewPercent={data.vocabulary.reviewPercent}
              />
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5f9e6e]" />
                  <span className="text-ink-muted">Known</span>
                  <span className="font-medium text-ink">
                    {data.vocabulary.known} ({data.vocabulary.knownPercent}%)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8b7ec8]" />
                  <span className="text-ink-muted">New</span>
                  <span className="font-medium text-ink">
                    {data.vocabulary.new} ({data.vocabulary.newPercent}%)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4895a]" />
                  <span className="text-ink-muted">Review</span>
                  <span className="font-medium text-ink">
                    {data.vocabulary.review} ({data.vocabulary.reviewPercent}%)
                  </span>
                </li>
              </ul>
            </div>
            <p className="mt-6 text-xs text-ink-muted">
              {isLive
                ? "Synced from reading_sessions + user_vocabulary."
                : "Demo preview — log in and read to see your real stats."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
