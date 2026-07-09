import { getTextForReader } from "@yomimasu/db";
import { notFound } from "next/navigation";
import { ReaderView } from "@/components/reader/reader-view";
import { SiteHeader } from "@/components/site-header";
import { getDb } from "@/lib/db";
import { getSessionProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ReaderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;
  const text = await getTextForReader(getDb(), slug);

  if (!text || text.sentences.length === 0) {
    notFound();
  }

  const { user } = await getSessionProfile();

  return (
    <>
      <SiteHeader startReadingHref={`/read/${slug}`} />
      <ReaderView text={text} isLoggedIn={Boolean(user)} />
    </>
  );
}
