import Link from "next/link";

const CATEGORIES = [
  {
    title: "N5 Daily Life",
    count: 24,
    href: "/#library",
    gradient: "from-[#f3d6c4] via-[#e8b89a] to-[#c97b63]",
  },
  {
    title: "N4 Stories",
    count: 28,
    href: "/read/n4-spring-picnic",
    gradient: "from-[#d9e8d4] via-[#a8c9a0] to-[#6f9b6a]",
  },
  {
    title: "N3 News",
    count: 20,
    href: "/#library",
    gradient: "from-[#d6e0ef] via-[#9eb4d4] to-[#5f7fa8]",
  },
  {
    title: "Travel",
    count: 18,
    href: "/#library",
    gradient: "from-[#f0e0c8] via-[#d4b48a] to-[#a67c52]",
  },
  {
    title: "Work & School",
    count: 20,
    href: "/#library",
    gradient: "from-[#e8d5e0] via-[#c9a0b4] to-[#8f6a7c]",
  },
] as const;

export function LandingCategories() {
  return (
    <section id="explore" className="mt-24">
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
            className="group overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:border-sakura/40"
          >
            <div
              className={`h-28 bg-gradient-to-br ${category.gradient} transition duration-500 group-hover:scale-[1.03]`}
              aria-hidden
            />
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
