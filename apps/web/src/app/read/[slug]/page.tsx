import { getTextForReader } from "@yomimasu/db";
import { notFound } from "next/navigation";
import { ReaderView } from "@/components/reader/reader-view";
import { getDb } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

type ReaderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;
  const text = await getTextForReader(getDb(), slug);

  if (!text || text.sentences.length === 0) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ReaderView text={text} isLoggedIn={Boolean(user)} />;
}
