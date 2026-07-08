import { ensureProfile } from "@yomimasu/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/app");
  }

  const profile = await ensureProfile(getDb(), {
    id: user.id,
    email: user.email,
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Dashboard
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
            Coming soon
          </h1>
          <p className="mt-4 text-ink-muted">
            Library, vocabulary, and progress tabs will live here.
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm text-ink-muted transition hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-white/80 p-5">
        <h2 className="text-sm font-medium text-ink">Profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd className="mt-1 text-ink">{profile.email ?? user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">JLPT level</dt>
            <dd className="mt-1 text-ink">{profile.jlptLevel}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Reading streak</dt>
            <dd className="mt-1 text-ink">{profile.readingStreakDays} days</dd>
          </div>
          <div>
            <dt className="text-ink-muted">User id</dt>
            <dd className="mt-1 break-all font-mono text-xs text-ink-muted">
              {profile.id}
            </dd>
          </div>
        </dl>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/read/n5-morning-routine"
          className="rounded-full bg-sakura-deep px-5 py-2.5 font-medium text-white transition hover:bg-[#b34d58]"
        >
          Start Reading
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line bg-white/80 px-5 py-2.5 text-ink-muted transition hover:text-ink"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
