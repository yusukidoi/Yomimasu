import {
  countUserAiUsage,
  countUserVocabulary,
  ensureProfile,
  getProgressSummary,
  listUserVocabulary,
} from "@yomimasu/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LandingProgressPreview } from "@/components/landing/landing-progress-preview";
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
  const counts = await countUserVocabulary(db, user.id);
  const progress = await getProgressSummary(db, user.id);
  const aiUsage = await countUserAiUsage(db, user.id);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Dashboard
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
            Your progress
          </h1>
          <p className="mt-4 text-ink-muted">
            Live from reading sessions and saved vocabulary.
            {profile.accountRole === "premium" ? " Premium account." : " Free account."}
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

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Saved words</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{counts.saved}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Known words</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{counts.known}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Reading streak</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {progress.streakDays} days
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Texts started</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {progress.textsStarted}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">Texts completed</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {progress.textsCompleted}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/80 p-5">
          <p className="text-sm text-ink-muted">AI explain requests</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{aiUsage.total}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {aiUsage.fresh} fresh · {aiUsage.cached} cached
          </p>
        </div>
      </section>

      <LandingProgressPreview progress={progress} isLive />

      <section className="mt-10 rounded-2xl border border-line bg-white/80 p-5">
        <h2 className="text-sm font-medium text-ink">Recent vocabulary</h2>
        {vocabulary.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            No saved words yet. Open a text and click a word to save it.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {vocabulary.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 text-sm"
              >
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
          href="/library"
          className="rounded-full bg-sakura-deep px-5 py-2.5 font-medium text-white transition hover:bg-[#b34d58]"
        >
          Open library
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
