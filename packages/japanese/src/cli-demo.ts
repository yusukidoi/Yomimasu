/**
 * Quick CLI check that Kuromoji can tokenize arbitrary Japanese
 * (not limited to the demo lexicon).
 *
 * Usage: pnpm --filter @yomimasu/japanese tokenize:demo
 */
import { processJapaneseText } from "./tokenizer";

const samples = [
  "今日もいい一日です。",
  "私は友達と公園へ行きました。",
  "朝七時に起きます。",
];

const input = process.argv.slice(2).join(" ") || samples.join("\n");

const result = await processJapaneseText(input);

for (const sentence of result.sentences) {
  console.log(`\n[${sentence.index}] ${sentence.surface}`);
  for (const token of sentence.tokens) {
    console.log(
      `  - ${token.surface.padEnd(8)} reading=${token.reading ?? "-"} lemma=${token.lemma ?? "-"} pos=${token.partOfSpeech ?? "-"} kind=${token.kind}`,
    );
  }
}

console.log(`\nTotal tokens: ${result.tokenCount}`);
