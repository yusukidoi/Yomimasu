import { canAccessPremiumContent, listPublishedTexts } from "@yomimasu/db";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { tryGetDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const { profile } = await getSessionProfile();
  const db = tryGetDb();
  const texts = db ? await listPublishedTexts(db) : [];

  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader startReadingHref="/library" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
          Library
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
          Published texts
        </h1>
        <p className="mt-4 text-ink-muted">
          Unpublished drafts stay in admin only. Premium texts require a
          premium account.
        </p>

        {texts.length === 0 ? (
          <p className="mt-10 text-sm text-ink-muted">
            No published texts yet. Ask an admin to publish from /admin.
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-line rounded-2xl border border-line bg-white/80">
            {texts.map((text) => {
              const allowed = canAccessPremiumContent({
                isFree: text.isFree,
                isAdmin: profile?.isAdmin,
                accountRole: profile?.accountRole,
              });
              return (
                <li
                  key={text.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="font-medium text-ink">{text.title}</p>
                    <p className="text-sm text-ink-muted">
                      {text.level}
                      {text.topic ? ` · ${text.topic}` : ""}
                      {text.isFree ? " · Free" : " · Premium"}
                    </p>
                  </div>
                  {allowed ? (
                    <Link
                      href={`/read/${text.slug}`}
                      className="rounded-full bg-sakura-deep px-4 py-2 text-sm font-medium text-white"
                    >
                      Read
                    </Link>
                  ) : (
                    <Link
                      href={`/read/${text.slug}`}
                      className="rounded-full border border-line px-4 py-2 text-sm text-ink-muted"
                    >
                      Locked
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
