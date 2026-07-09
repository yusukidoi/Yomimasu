import Image from "next/image";
import {
  BookmarkIcon,
  ChartIcon,
  SparklesIcon,
} from "./landing-icons";

const FEATURES = [
  {
    title: "Saved vocabulary",
    description: "Save words and review them anytime.",
    icon: BookmarkIcon,
    iconClass: "bg-[#e7f4ea] text-[#3f8a52]",
  },
  {
    title: "Progress tracking",
    description: "Track your reading and vocabulary growth.",
    icon: ChartIcon,
    iconClass: "bg-[#f8ebe0] text-[#c47a45]",
  },
  {
    title: "AI sentence help",
    description: "Get clear explanations for any sentence.",
    icon: SparklesIcon,
    iconClass: "bg-[#ece8f8] text-[#6f5fb0]",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="relative mt-24">
      <Image
        src="/decorations/sakura-vertical.png"
        alt=""
        aria-hidden
        width={200}
        height={267}
        className="pointer-events-none absolute -right-10 top-8 hidden w-40 select-none mix-blend-multiply lg:block"
      />

      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Turn reading into real Japanese progress.
        </h2>
        <p className="mt-2 text-ink-muted">
          Every tool you need to read more, understand faster, and remember
          longer.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-line bg-white/80 p-6 transition hover:border-sakura/40 hover:shadow-[0_18px_40px_rgba(43,38,36,0.06)]"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-medium text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
