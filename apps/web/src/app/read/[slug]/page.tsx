type ReaderPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">Reader</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink">Coming soon</h1>
      <p className="mt-4 text-ink-muted">
        Text slug: <code className="rounded bg-paper px-2 py-1">{slug}</code>
      </p>
    </main>
  );
}
