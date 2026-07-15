import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "./landing-icons";

export type FreeText = {
  id: string;
  slug: string;
  title: string;
  titleJa: string | null;
  level: string;
  topic: string | null;
  summary: string | null;
  estimatedMinutes: number;
  headerImageUrl?: string | null;
};

const IMAGE_BY_SLUG: Record<string, string> = {
  "n5-morning-routine": "/texts/text-morning-routine.png",
  "n4-spring-picnic": "/texts/text-spring-picnic.png",
};

const FALLBACK_IMAGES = [
  "/texts/text-morning-routine.png",
  "/texts/text-spring-picnic.png",
];

function imageForText(
  slug: string,
  index: number,
  headerImageUrl?: string | null,
) {
  if (headerImageUrl) return headerImageUrl;
  return IMAGE_BY_SLUG[slug] ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function CoverImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const isRemote = /^https?:\/\//i.test(src);
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, 176px"
      className="object-cover"
    />
  );
}

type LandingFreeTextsProps = {
  texts: FreeText[];
};

export function LandingFreeTexts({ texts }: LandingFreeTextsProps) {
  return (
    <section id="library" className="mt-24">
      <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
        Start reading now with {texts.length} free{" "}
        {texts.length === 1 ? "text" : "texts"}.
      </h2>
      <p className="mt-2 text-ink-muted">
        Easy, engaging stories. Click to start reading instantly.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {texts.map((text, index) => (
          <article
            key={text.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:border-sakura/40 hover:shadow-[0_18px_40px_rgba(43,38,36,0.06)] sm:flex-row"
          >
            <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-44">
              <CoverImage
                src={imageForText(text.slug, index, text.headerImageUrl)}
                alt={text.title}
              />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="inline-flex w-fit rounded-full bg-sakura-deep/10 px-3 py-1 text-xs font-medium text-sakura-deep">
                Free text
              </span>
              {text.topic ? (
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-muted">
                  {text.topic}
                </p>
              ) : null}
              <h3 className="mt-3 text-lg font-semibold text-ink">
                {text.title}
              </h3>
              {text.titleJa ? (
                <p className="font-display text-sm text-ink-muted">
                  {text.titleJa}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {text.summary ?? `${text.estimatedMinutes} min read`}
              </p>

              <Link
                href={`/read/${text.slug}`}
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-sakura-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b34d58]"
              >
                Read now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
