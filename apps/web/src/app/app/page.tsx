import { ensureProfile, listUserVocabulary } from "@yomimasu/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/app");
  }

  const db = getDb();
  const profile = await ensureProfile(db, {
    id: user.id,
    email: user.email,
  });

  const vocabulary = await listUserVocabulary(db, user.id, 8);
  const savedCount = vocabulary.filter((item) => item.status === "saved").length;
  const knownCount = vocabulary.filter((item) => item.status === "known").length;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Dashboard
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
            Your progress
          </h1>
          <p className="mt-4 text-ink-muted">
            Save words while reading, then review them here.
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

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Saved words</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{savedCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Known words</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{knownCount}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Reading streak</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {profile.readingStreakDays} days
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-white/80 p-5">
        <h2 className="text-sm font-medium text-ink">Recent vocabulary</h2>
        {vocabulary.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            No saved words yet. Open a text and click a word to save it.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {vocabulary.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{item.surface}</p>
                  <p className="text-ink-muted">
                    {item.reading ? `${item.reading} · ` : ""}
                    {item.meaning ?? "—"}
                  </p>
                </div>
                <span className="rounded-full bg-paper px-3 py-1 text-xs capitalize text-ink-muted">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/read/n4-spring-picnic"
          className="rounded-full bg-sakura-deep px-5 py-2.5 font-medium text-white transition hover:bg-[#b34d58]"
        >
          Try Spring Picnic
        </Link>
        <Link
          href="/read/n5-morning-routine"
          className="rounded-full border border-line bg-white/80 px-5 py-2.5 text-ink-muted transition hover:text-ink"
        >
          N5 Morning Routine
        </Link>
      </div>
    </main>
  );
}
