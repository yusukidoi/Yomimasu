import * as kuromoji from "@patdx/kuromoji";
import NodeDictionaryLoader from "@patdx/kuromoji/node";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  mapTokenKind,
  readingForFurigana,
  splitParagraphs,
  splitSentences,
} from "./normalize";
import type { ProcessedSentence, ProcessedText, ProcessedToken } from "./types";

type KuromojiToken = {
  surface_form: string;
  reading?: string;
  pronunciation?: string;
  basic_form?: string;
  pos?: string;
  pos_detail_1?: string;
  pos_detail_2?: string;
  pos_detail_3?: string;
  conjugated_type?: string;
  conjugated_form?: string;
};

type Tokenizer = {
  tokenize: (text: string) => KuromojiToken[];
};

let tokenizerPromise: Promise<Tokenizer> | null = null;

function isDictDir(path: string) {
  return existsSync(join(path, "base.dat.gz"));
}

/**
 * Resolve Kuromoji's on-disk dictionary.
 * Next/Turbopack can mangle `require.resolve` into a fake `.../[project]/...`
 * path, so we prefer filesystem discovery from cwd / this file.
 */
function dictionaryPath() {
  const candidates: string[] = [];

  const pushResolved = (from: string) => {
    try {
      const entry = createRequire(from).resolve("@patdx/kuromoji");
      // resolve() → .../build/index.mjs — dict/ is next to build/
      candidates.push(join(dirname(entry), "..", "dict"));
      candidates.push(join(dirname(entry), "dict"));
    } catch {
      // ignore — try other strategies
    }
  };

  // 1) From this module (works under tsx / direct Node).
  try {
    pushResolved(fileURLToPath(import.meta.url));
  } catch {
    // ignore
  }

  // 2) Walk up from cwd and from this file looking for installed package.
  const walkStarts = [process.cwd()];
  try {
    walkStarts.push(dirname(fileURLToPath(import.meta.url)));
  } catch {
    // ignore
  }

  for (const start of walkStarts) {
    let dir = start;
    for (let i = 0; i < 10; i += 1) {
      candidates.push(join(dir, "node_modules", "@patdx", "kuromoji", "dict"));
      candidates.push(
        join(
          dir,
          "packages",
          "japanese",
          "node_modules",
          "@patdx",
          "kuromoji",
          "dict",
        ),
      );
      pushResolved(join(dir, "package.json"));
      pushResolved(join(dir, "packages", "japanese", "package.json"));

      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  // Prefer real filesystem hits; skip Turbopack's fake `[project]` paths.
  for (const candidate of candidates) {
    if (candidate.includes(`${join("", "[project]")}`) || candidate.includes("[project]")) {
      continue;
    }
    if (isDictDir(candidate)) return candidate;
  }

  for (const candidate of candidates) {
    if (isDictDir(candidate)) return candidate;
  }

  throw new Error(
    "Kuromoji dictionary not found (base.dat.gz). Reinstall deps with pnpm install.",
  );
}

/**
 * Build (and cache) a Kuromoji tokenizer instance.
 * This is the Milestone 1 morphological analyzer — not the demo lexicon.
 */
export async function getTokenizer(): Promise<Tokenizer> {
  if (!tokenizerPromise) {
    const dicPath = dictionaryPath();
    tokenizerPromise = new kuromoji.TokenizerBuilder({
      loader: new NodeDictionaryLoader({
        dic_path: dicPath,
      }),
    })
      .build()
      .then((tokenizer) => tokenizer as Tokenizer)
      .catch((error) => {
        // Allow retry after fixing install / path issues.
        tokenizerPromise = null;
        throw error;
      });
  }
  return tokenizerPromise;
}

function fullPos(token: KuromojiToken): string {
  return [
    token.pos,
    token.pos_detail_1,
    token.pos_detail_2,
    token.pos_detail_3,
  ]
    .filter((part) => part && part !== "*")
    .join("-");
}

function grammarForm(token: KuromojiToken): string | null {
  const parts = [token.conjugated_type, token.conjugated_form].filter(
    (part) => part && part !== "*",
  );
  return parts.length > 0 ? parts.join(" / ") : null;
}

function toProcessedToken(
  token: KuromojiToken,
  index: number,
): ProcessedToken {
  const surface = token.surface_form;
  const pos = fullPos(token);
  const kind = mapTokenKind(pos);
  const lemma =
    token.basic_form && token.basic_form !== "*"
      ? token.basic_form
      : surface;

  return {
    index,
    surface,
    reading: readingForFurigana(surface, token.reading ?? token.pronunciation),
    lemma,
    // Meaning comes from dictionary matching in a later step / admin override.
    meaning: null,
    partOfSpeech: pos || null,
    kind,
    grammarForm: grammarForm(token),
  };
}

/**
 * Process arbitrary Japanese text into sentences + tokens.
 * Output is ready to persist into `text_sentences` / `text_tokens`.
 */
export async function processJapaneseText(body: string): Promise<ProcessedText> {
  const tokenizer = await getTokenizer();
  const paragraphs = splitParagraphs(body);
  const sentences: ProcessedSentence[] = [];
  let globalTokenIndex = 0;
  let sentenceIndex = 0;

  for (const paragraph of paragraphs) {
    for (const sentenceSurface of splitSentences(paragraph)) {
      const rawTokens = tokenizer.tokenize(sentenceSurface);
      const tokens = rawTokens
        .filter((token) => token.surface_form.trim().length > 0)
        .map((token) => {
          const processed = toProcessedToken(token, globalTokenIndex);
          globalTokenIndex += 1;
          return processed;
        });

      sentences.push({
        index: sentenceIndex,
        surface: sentenceSurface,
        tokens,
      });
      sentenceIndex += 1;
    }
  }

  return {
    sentences,
    tokenCount: globalTokenIndex,
  };
}
