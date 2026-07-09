import type { TokenKind } from "@yomimasu/shared";

const PARTICLE_POS = new Set([
  "助詞",
  "接続助詞",
  "係助詞",
  "格助詞",
  "副助詞",
  "終助詞",
]);

const PUNCTUATION_POS = new Set(["記号"]);

/**
 * Map Kuromoji POS tags into our reader token kinds.
 */
export function mapTokenKind(pos: string | undefined): TokenKind {
  if (!pos) return "other";
  const primary = pos.split("-")[0] ?? pos;
  if (PUNCTUATION_POS.has(primary) || /記号|句点|読点|括弧/.test(pos)) {
    return "punctuation";
  }
  if (PARTICLE_POS.has(primary) || pos.includes("助詞")) {
    return "particle";
  }
  if (
    pos.includes("名詞") ||
    pos.includes("動詞") ||
    pos.includes("形容詞") ||
    pos.includes("副詞") ||
    pos.includes("連体詞") ||
    pos.includes("感動詞") ||
    pos.includes("接頭詞") ||
    pos.includes("フィラー")
  ) {
    return "word";
  }
  return "other";
}

/**
 * Convert katakana reading from Kuromoji into hiragana for furigana display.
 */
export function katakanaToHiragana(value: string): string {
  return value.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60),
  );
}

/**
 * Prefer a reading only when the surface contains kanji.
 * Kana-only tokens should not show furigana.
 */
export function readingForFurigana(
  surface: string,
  reading: string | null | undefined,
): string | null {
  if (!reading || reading === "*") return null;
  if (!/[\u4E00-\u9FFF]/.test(surface)) return null;
  const normalized = katakanaToHiragana(reading);
  if (!normalized || normalized === surface) return null;
  return normalized;
}

export function splitParagraphs(body: string): string[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Split a paragraph into sentence-like units on Japanese punctuation,
 * keeping the delimiter attached to the sentence.
 */
export function splitSentences(paragraph: string): string[] {
  const parts = paragraph
    .split(/(?<=[。！？!?])/u)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [paragraph];
}
