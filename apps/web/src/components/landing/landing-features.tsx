import Image from "next/image";
import type { ReactNode } from "react";
import {
  BookmarkIcon,
  ChartIcon,
  ChatIcon,
  CursorClickIcon,
  SparklesIcon,
} from "./landing-icons";

type Feature = {
  title: string;
  description: string;
  circleClass: string;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: "Clickable words",
    description: "Click any word for meanings and forms.",
    circleClass: "bg-[#fbe4e6] text-sakura-deep",
    icon: <CursorClickIcon className="h-5 w-5" />,
  },
  {
    title: "Furigana & readings",
    description: "See readings above kanji automatically.",
    circleClass: "bg-[#eee9e4] text-ink",
    icon: <span className="font-display text-lg leading-none">あ</span>,
  },
  {
    title: "Grammar in context",
    description: "Understand grammar through real examples.",
    circleClass: "bg-[#e2ebf6] text-[#5f7fa8]",
    icon: <ChatIcon className="h-5 w-5" />,
  },
  {
    title: "Saved vocabulary",
    description: "Save words and review them anytime.",
    circleClass: "bg-[#e7f4ea] text-[#3f8a52]",
    icon: <BookmarkIcon className="h-5 w-5" />,
  },
  {
    title: "Progress tracking",
    description: "Track your reading and vocabulary growth.",
    circleClass: "bg-[#f8ebe0] text-[#c47a45]",
    icon: <ChartIcon className="h-5 w-5" />,
  },
  {
    title: "AI sentence help",
    description: "Get clear explanations for any sentence.",
    circleClass: "bg-[#ece8f8] text-[#6f5fb0]",
    icon: <SparklesIcon className="h-5 w-5" />,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="relative mt-24">
      <Image
        src="/decorations/sakura-vertical.png?v=2"
        alt=""
        aria-hidden
        width={200}
        height={267}
        className="pointer-events-none absolute -right-16 -top-10 hidden w-44 rotate-[38deg] select-none mix-blend-multiply lg:block"
      />

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Everything you need to turn reading into real Japanese progress.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col items-center rounded-2xl border border-line bg-white/80 px-4 py-6 text-center transition hover:border-sakura/40 hover:shadow-[0_18px_40px_rgba(43,38,36,0.06)]"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.circleClass}`}
            >
              {feature.icon}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-ink">
              {feature.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
