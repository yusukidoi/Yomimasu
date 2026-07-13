import { DEMO_LEXICON } from "../seed/token-dictionary";
import {
  COMMON_LEMMA_MEANINGS,
  COMMON_SURFACE_MEANINGS,
} from "./common-words";

const PARTICLE_MEANINGS: Record<string, string> = {
  は: "topic marker",
  が: "subject marker",
  を: "object marker",
  に: "time / location / indirect object marker",
  へ: "direction marker",
  で: "location of action / means",
  と: "with / and",
  も: "also / too",
  の: "possessive / modifier",
  から: "from / because",
  まで: "until / as far as",
  より: "than / from",
  や: "and (incomplete list)",
  ね: "seeking agreement",
  よ: "emphasis",
  か: "question marker",
};

const demoBySurface = new Map(
  DEMO_LEXICON.map((entry) => [entry.surface, entry.meaning] as const),
);
const demoByLemma = new Map(
  DEMO_LEXICON.map((entry) => [entry.lemma, entry.meaning] as const),
);

/**
 * Resolve an English gloss for a token at process/store time.
 * Priority: particles → demo surface → common surface → demo lemma → common lemma.
 */
export function lookupTokenMeaning(
  surface: string,
  lemma: string | null,
  kind: string,
): string | null {
  if (kind === "particle") {
    return PARTICLE_MEANINGS[surface] ?? PARTICLE_MEANINGS[lemma ?? ""] ?? null;
  }

  if (kind === "punctuation") {
    return demoBySurface.get(surface) ?? null;
  }

  return (
    demoBySurface.get(surface) ??
    COMMON_SURFACE_MEANINGS[surface] ??
    (lemma ? demoByLemma.get(lemma) : undefined) ??
    (lemma ? COMMON_LEMMA_MEANINGS[lemma] : undefined) ??
    null
  );
}
