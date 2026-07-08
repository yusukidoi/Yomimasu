export type JlptLevel = "N5" | "N4" | "N3";

export type TextStatus = "draft" | "published" | "archived";

export type WordStatus = "unseen" | "read" | "saved" | "known";

export type TokenKind = "word" | "particle" | "punctuation" | "other";

export type HealthResponse = {
  status: "ok";
  service: "yomimasu-api";
  timestamp: string;
};

export const APP_NAME = "Yomimasu" as const;

export const JLPT_LEVELS: JlptLevel[] = ["N5", "N4", "N3"];
