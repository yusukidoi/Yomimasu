import { listAllTexts } from "@yomimasu/db";
import Link from "next/link";
import { ProcessTextForm } from "@/components/admin/process-text-form";
import { TextStatusControls } from "@/components/admin/text-status-controls";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin("/admin");
  const texts = await listAllTexts(getDb());

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-sakura-deep">
            Admin
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
            Content
          </h1>
          <p className="mt-4 text-ink-muted">
            Process Japanese, choose draft or published, then correct tokens.
          </p>
        </div>
        <Link
          href="/app"
          className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm text-ink-muted transition hover:text-ink"
        >
          Dashboard
        </Link>
      </div>

      <nav className="mt-8 flex gap-2 text-sm">
        <span className="rounded-full bg-sakura-deep px-4 py-2 font-medium text-white">
          Texts
        </span>
        <span className="rounded-full border border-line px-4 py-2 text-ink-muted">
          Tokens → open from a row
        </span>
      </nav>

      <ProcessTextForm existingSlugs={texts.map((text) => text.slug)} />

      <section className="mt-10 overflow-hidden rounded-2xl border border-line bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper/80 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Free</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {texts.map((text) => (
              <tr key={text.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{text.title}</p>
                  <p className="text-xs text-ink-muted">{text.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink">{text.level}</td>
                <td className="px-4 py-3">
                  <p className="capitalize text-ink-muted">{text.status}</p>
                  <div className="mt-1">
                    <TextStatusControls
                      slug={text.slug}
                      status={text.status}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {text.isFree ? "Yes" : "No"}
                </td>
                <td className="space-x-3 px-4 py-3">
                  <Link
                    href={
                      text.status === "published"
                        ? `/read/${text.slug}`
                        : `/read/${text.slug}?preview=1`
                    }
                    className="font-medium text-sakura-deep hover:underline"
                  >
                    {text.status === "published" ? "Reader" : "Preview"}
                  </Link>
                  <Link
                    href={`/admin/texts/${text.slug}/tokens`}
                    className="font-medium text-ink hover:underline"
                  >
                    Tokens
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-6 text-sm text-ink-muted">
        To grant admin access, run{" "}
        <code className="rounded bg-paper px-1.5 py-0.5">
          pnpm admin:grant your@email.com
        </code>
        . For premium library access:{" "}
        <code className="rounded bg-paper px-1.5 py-0.5">
          pnpm role:set your@email.com premium
        </code>
        .
      </p>
    </main>
  );
}
