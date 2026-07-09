import Link from "next/link";
import { getSessionProfile } from "@/lib/auth";

type SiteHeaderProps = {
  startReadingHref?: string;
};

export async function SiteHeader({
  startReadingHref = "/read/n5-morning-routine",
}: SiteHeaderProps) {
  const { user, profile } = await getSessionProfile();
  const isLoggedIn = Boolean(user);
  const isAdmin = Boolean(profile?.isAdmin);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl text-sakura" aria-hidden>
          ✿
        </span>
        <span className="font-display text-2xl font-semibold tracking-tight text-ink">
          Yomimasu
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
        <Link href="/#features">Features</Link>
        <Link href="/#library">Library</Link>
        <Link href="/app">Dashboard</Link>
        {isAdmin ? (
          <Link href="/admin" className="font-medium text-sakura-deep hover:text-[#b34d58]">
            Admin
          </Link>
        ) : null}
      </nav>

      <div className="flex items-center gap-3 text-sm">
        {!isLoggedIn ? (
          <Link href="/login" className="text-ink-muted hover:text-ink">
            Log in
          </Link>
        ) : null}
        <Link
          href="/app"
          className="rounded-full border border-line bg-white/70 px-4 py-2 font-medium text-ink transition hover:bg-white"
        >
          Dashboard
        </Link>
        {isAdmin ? (
          <Link
            href="/admin"
            className="rounded-full border border-sakura-deep/30 bg-sakura-deep/10 px-4 py-2 font-medium text-sakura-deep transition hover:bg-sakura-deep/15 md:hidden"
          >
            Admin
          </Link>
        ) : null}
        <Link
          href={startReadingHref}
          className="rounded-full bg-sakura-deep px-4 py-2 font-medium text-white transition hover:bg-[#b34d58]"
        >
          Start Reading
        </Link>
      </div>
    </header>
  );
}
