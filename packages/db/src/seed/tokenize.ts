import type { TokenKind } from "@yomimasu/shared";
import { DEMO_LEXICON, type LexEntry } from "./token-dictionary";

export type DemoToken = {
  index: number;
  surface: string;
  reading: string | null;
  lemma: string | null;
  meaning: string | null;
  partOfSpeech: string | null;
  kind: TokenKind;
  grammarForm: string | null;
};

const lexiconByLength = [...DEMO_LEXICON].sort(
  (a, b) => b.surface.length - a.surface.length,
);

function lookup(surface: string): LexEntry | null {
  return DEMO_LEXICON.find((entry) => entry.surface === surface) ?? null;
}

function fallbackToken(surface: string, index: number): DemoToken {
  return {
    index,
    surface,
    reading: null,
    lemma: surface,
    meaning: null,
    partOfSpeech: null,
    kind: "other",
    grammarForm: null,
  };
}

export function tokenizeSentence(sentence: string): DemoToken[] {
  const tokens: DemoToken[] = [];
  let position = 0;
  let index = 0;

  while (position < sentence.length) {
    let matched: LexEntry | null = null;

    for (const entry of lexiconByLength) {
      if (sentence.startsWith(entry.surface, position)) {
        matched = entry;
        break;
      }
    }

    if (matched) {
      tokens.push({
        index,
        surface: matched.surface,
        reading: matched.reading || null,
        lemma: matched.lemma,
        meaning: matched.meaning,
        partOfSpeech: matched.partOfSpeech,
        kind: matched.kind,
        grammarForm: matched.grammarForm ?? null,
      });
      position += matched.surface.length;
      index += 1;
      continue;
    }

    const char = sentence[position] ?? "";
    const charEntry = lookup(char);
    tokens.push(
      charEntry
        ? {
            index,
            surface: charEntry.surface,
            reading: charEntry.reading || null,
            lemma: charEntry.lemma,
            meaning: charEntry.meaning,
            partOfSpeech: charEntry.partOfSpeech,
            kind: charEntry.kind,
            grammarForm: charEntry.grammarForm ?? null,
          }
        : fallbackToken(char, index),
    );
    position += 1;
    index += 1;
  }

  return tokens;
}

export function splitSentences(body: string) {
  return body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
