import { canAccessPremiumContent, getTextForReader } from "@yomimasu/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReaderView } from "@/components/reader/reader-view";
import { SiteHeader } from "@/components/site-header";
import { getDb } from "@/lib/db";
import { getSessionProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ReaderPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export default async function ReaderPage({
  params,
  searchParams,
}: ReaderPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { user, profile } = await getSessionProfile();

  const allowUnpublished =
    Boolean(profile?.isAdmin) && preview === "1";

  const text = await getTextForReader(getDb(), slug, { allowUnpublished });

  if (!text || text.sentences.length === 0) {
    notFound();
  }

  const allowed = canAccessPremiumContent({
    isFree: text.isFree,
    isAdmin: profile?.isAdmin,
    accountRole: profile?.accountRole,
  });

  if (!allowed) {
    return (
      <>
        <SiteHeader startReadingHref={`/read/${slug}`} />
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Premium text
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold text-ink">
            {text.title}
          </h1>
          <p className="mt-4 text-ink-muted">
            This text is available to premium accounts
            {user ? "" : " after you log in"}. Free users can still open free
            library texts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!user ? (
              <Link
                href={`/login?next=/read/${slug}`}
                className="rounded-full bg-sakura-deep px-5 py-2.5 text-sm font-medium text-white"
              >
                Log in
              </Link>
            ) : null}
            <Link
              href="/library"
              className="rounded-full border border-line bg-white/80 px-5 py-2.5 text-sm text-ink-muted"
            >
              Back to library
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader startReadingHref={`/read/${slug}`} />
      <ReaderView text={text} isLoggedIn={Boolean(user)} />
    </>
  );
}
