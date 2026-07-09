import type { TokenKind } from "@yomimasu/shared";

/**
 * Normalized token shape used by the reader / DB layer.
 * Milestone 1 stores these fields in `text_tokens`.
 */
export type ProcessedToken = {
  index: number;
  surface: string;
  reading: string | null;
  lemma: string | null;
  meaning: string | null;
  partOfSpeech: string | null;
  kind: TokenKind;
  grammarForm: string | null;
};

export type ProcessedSentence = {
  index: number;
  surface: string;
  tokens: ProcessedToken[];
};

export type ProcessedText = {
  sentences: ProcessedSentence[];
  tokenCount: number;
};
