export type JlptLevel = "N5" | "N4" | "N3";

export type TextStatus = "draft" | "published" | "archived";

export type WordStatus = "unseen" | "read" | "saved" | "known";

export type TokenKind = "word" | "particle" | "punctuation" | "other";

export type ReaderToken = {
  id: string;
  index: number;
  surface: string;
  reading: string | null;
  lemma: string | null;
  meaning: string | null;
  partOfSpeech: string | null;
  kind: TokenKind;
  grammarForm: string | null;
};

export type ReaderSentence = {
  id: string;
  index: number;
  surface: string;
  tokens: ReaderToken[];
};

export type ReaderText = {
  id: string;
  slug: string;
  title: string;
  titleJa: string | null;
  level: JlptLevel;
  topic: string | null;
  summary: string | null;
  translationEn: string | null;
  estimatedMinutes: number;
  wordCount: number;
  isFree: boolean;
  sentences: ReaderSentence[];
};

export type HealthResponse = {
  status: "ok";
  service: "yomimasu-api";
  timestamp: string;
};

export const APP_NAME = "Yomimasu" as const;

export const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3"];
