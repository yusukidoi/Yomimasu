import * as kuromoji from "@patdx/kuromoji";
import NodeDictionaryLoader from "@patdx/kuromoji/node";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
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

function dictionaryPath() {
  const require = createRequire(import.meta.url);
  // resolve() points at build/index.mjs — dict/ sits on the package root.
  const entry = require.resolve("@patdx/kuromoji");
  return join(dirname(entry), "..", "dict");
}

/**
 * Build (and cache) a Kuromoji tokenizer instance.
 * This is the Milestone 1 morphological analyzer — not the demo lexicon.
 */
export async function getTokenizer(): Promise<Tokenizer> {
  if (!tokenizerPromise) {
    tokenizerPromise = new kuromoji.TokenizerBuilder({
      loader: new NodeDictionaryLoader({
        dic_path: dictionaryPath(),
      }),
    }).build() as Promise<Tokenizer>;
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
