import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "N5 Daily Life",
    count: 24,
    href: "/#library",
    image: "/texts/cat-daily-life.png",
  },
  {
    title: "N4 Stories",
    count: 28,
    href: "/read/n4-spring-picnic",
    image: "/texts/cat-stories.png",
  },
  {
    title: "N3 News",
    count: 20,
    href: "/#library",
    image: "/texts/cat-news.png",
  },
  {
    title: "Travel",
    count: 18,
    href: "/#library",
    image: "/texts/cat-travel.png",
  },
  {
    title: "Work & School",
    count: 20,
    href: "/#library",
    image: "/texts/cat-work-school.png",
  },
] as const;

export function LandingCategories() {
  return (
    <section id="explore" className="relative mt-24">
      <Image
        src="/decorations/sakura-vertical.png"
        alt=""
        aria-hidden
        width={180}
        height={240}
        className="pointer-events-none absolute -left-16 top-24 hidden w-36 -scale-x-100 select-none mix-blend-multiply xl:block"
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            Keep growing with texts at every level.
          </h2>
          <p className="mt-2 max-w-xl text-ink-muted">
            Discover stories that match your level, interests, and goals.
          </p>
        </div>
        <Link
          href="/app"
          className="text-sm font-medium text-sakura-deep transition hover:text-[#b34d58]"
        >
          Browse all →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:border-sakura/40 hover:shadow-[0_18px_40px_rgba(43,38,36,0.06)]"
          >
            <div className="relative h-28 overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-ink">{category.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{category.count} texts</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
