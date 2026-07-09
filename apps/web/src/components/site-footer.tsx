import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Library", href: "/#library" },
      { label: "Features", href: "/#features" },
      { label: "Dashboard", href: "/app" },
      { label: "Progress", href: "/#progress" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Free texts", href: "/#library" },
      { label: "Categories", href: "/#explore" },
      { label: "N5 Morning Routine", href: "/read/n5-morning-routine" },
      { label: "N4 Spring Picnic", href: "/read/n4-spring-picnic" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/login" },
      { label: "Dashboard", href: "/app" },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-white/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl text-sakura" aria-hidden>
              ✿
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Yomimasu
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            Master Japanese reading at your level. Click words for instant
            readings, meanings, and grammar help while you read.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="text-sm font-semibold text-ink">{column.heading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-ink-muted transition hover:text-sakura-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row">
          <p>&copy; {year} Yomimasu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#" className="transition hover:text-ink">
              Privacy
            </Link>
            <Link href="/#" className="transition hover:text-ink">
              Terms
            </Link>
            <Link href="/#" className="transition hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
