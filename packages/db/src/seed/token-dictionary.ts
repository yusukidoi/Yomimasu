import type { TokenKind } from "@yomimasu/shared";

export type LexEntry = {
  surface: string;
  reading: string;
  lemma: string;
  meaning: string;
  partOfSpeech: string;
  kind: TokenKind;
  grammarForm?: string;
};

/**
 * Curated demo dictionary for the two free sample texts.
 * Full Sudachi/JMdict pipeline will replace this later.
 */
export const DEMO_LEXICON: LexEntry[] = [
  { surface: "先週", reading: "せんしゅう", lemma: "先週", meaning: "last week", partOfSpeech: "noun", kind: "word" },
  { surface: "土曜日", reading: "どようび", lemma: "土曜日", meaning: "Saturday", partOfSpeech: "noun", kind: "word" },
  { surface: "私", reading: "わたし", lemma: "私", meaning: "I / me", partOfSpeech: "pronoun", kind: "word" },
  { surface: "私たち", reading: "わたしたち", lemma: "私", meaning: "we / us", partOfSpeech: "pronoun", kind: "word" },
  { surface: "友達", reading: "ともだち", lemma: "友達", meaning: "friend / friends", partOfSpeech: "noun", kind: "word" },
  { surface: "友だち", reading: "ともだち", lemma: "友達", meaning: "friend / friends", partOfSpeech: "noun", kind: "word" },
  { surface: "公園", reading: "こうえん", lemma: "公園", meaning: "park", partOfSpeech: "noun", kind: "word" },
  { surface: "行きました", reading: "いきました", lemma: "行く", meaning: "went", partOfSpeech: "verb", kind: "word", grammarForm: "polite past" },
  { surface: "行きます", reading: "いきます", lemma: "行く", meaning: "go", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "空", reading: "そら", lemma: "空", meaning: "sky", partOfSpeech: "noun", kind: "word" },
  { surface: "青くて", reading: "あおくて", lemma: "青い", meaning: "was blue and", partOfSpeech: "adjective", kind: "word", grammarForm: "te-form" },
  { surface: "とても", reading: "とても", lemma: "とても", meaning: "very", partOfSpeech: "adverb", kind: "word" },
  { surface: "天気", reading: "てんき", lemma: "天気", meaning: "weather", partOfSpeech: "noun", kind: "word" },
  { surface: "でした", reading: "でした", lemma: "です", meaning: "was", partOfSpeech: "copula", kind: "word", grammarForm: "polite past" },
  { surface: "お弁当", reading: "おべんとう", lemma: "弁当", meaning: "lunchbox / bento", partOfSpeech: "noun", kind: "word" },
  { surface: "持って", reading: "もって", lemma: "持つ", meaning: "bringing / holding", partOfSpeech: "verb", kind: "word", grammarForm: "te-form" },
  { surface: "桜", reading: "さくら", lemma: "桜", meaning: "cherry blossom", partOfSpeech: "noun", kind: "word" },
  { surface: "木", reading: "き", lemma: "木", meaning: "tree", partOfSpeech: "noun", kind: "word" },
  { surface: "下", reading: "した", lemma: "下", meaning: "under / below", partOfSpeech: "noun", kind: "word" },
  { surface: "座りました", reading: "すわりました", lemma: "座る", meaning: "sat", partOfSpeech: "verb", kind: "word", grammarForm: "polite past" },
  { surface: "おいしい", reading: "おいしい", lemma: "おいしい", meaning: "delicious", partOfSpeech: "adjective", kind: "word" },
  { surface: "おにぎり", reading: "おにぎり", lemma: "おにぎり", meaning: "rice ball", partOfSpeech: "noun", kind: "word" },
  { surface: "作りました", reading: "つくりました", lemma: "作る", meaning: "made", partOfSpeech: "verb", kind: "word", grammarForm: "polite past" },
  { surface: "果物", reading: "くだもの", lemma: "果物", meaning: "fruit", partOfSpeech: "noun", kind: "word" },
  { surface: "みんな", reading: "みんな", lemma: "みんな", meaning: "everyone", partOfSpeech: "noun", kind: "word" },
  { surface: "食べながら", reading: "たべながら", lemma: "食べる", meaning: "while eating", partOfSpeech: "verb", kind: "word", grammarForm: "while doing" },
  { surface: "話しました", reading: "はなしました", lemma: "話す", meaning: "talked", partOfSpeech: "verb", kind: "word", grammarForm: "polite past" },
  { surface: "話します", reading: "はなします", lemma: "話す", meaning: "talk", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "夕方", reading: "ゆうがた", lemma: "夕方", meaning: "evening", partOfSpeech: "noun", kind: "word" },
  { surface: "まで", reading: "まで", lemma: "まで", meaning: "until", partOfSpeech: "particle", kind: "particle" },
  { surface: "いました", reading: "いました", lemma: "いる", meaning: "was / stayed", partOfSpeech: "verb", kind: "word", grammarForm: "polite past" },
  { surface: "楽しい", reading: "たのしい", lemma: "楽しい", meaning: "fun / enjoyable", partOfSpeech: "adjective", kind: "word" },
  { surface: "一日", reading: "いちにち", lemma: "一日", meaning: "day", partOfSpeech: "noun", kind: "word" },
  { surface: "朝", reading: "あさ", lemma: "朝", meaning: "morning", partOfSpeech: "noun", kind: "word" },
  { surface: "七時", reading: "しちじ", lemma: "七時", meaning: "7 o'clock", partOfSpeech: "noun", kind: "word" },
  { surface: "八時", reading: "はちじ", lemma: "八時", meaning: "8 o'clock", partOfSpeech: "noun", kind: "word" },
  { surface: "起きます", reading: "おきます", lemma: "起きる", meaning: "wake up", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "まず", reading: "まず", lemma: "まず", meaning: "first", partOfSpeech: "adverb", kind: "word" },
  { surface: "顔", reading: "かお", lemma: "顔", meaning: "face", partOfSpeech: "noun", kind: "word" },
  { surface: "洗います", reading: "あらいます", lemma: "洗う", meaning: "wash", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "それから", reading: "それから", lemma: "それから", meaning: "then / after that", partOfSpeech: "conjunction", kind: "word" },
  { surface: "朝ごはん", reading: "あさごはん", lemma: "朝ごはん", meaning: "breakfast", partOfSpeech: "noun", kind: "word" },
  { surface: "食べます", reading: "たべます", lemma: "食べる", meaning: "eat", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "パン", reading: "ぱん", lemma: "パン", meaning: "bread", partOfSpeech: "noun", kind: "word" },
  { surface: "ミルク", reading: "みるく", lemma: "ミルク", meaning: "milk", partOfSpeech: "noun", kind: "word" },
  { surface: "です", reading: "です", lemma: "です", meaning: "is / am / are", partOfSpeech: "copula", kind: "word", grammarForm: "polite present" },
  { surface: "家", reading: "いえ", lemma: "家", meaning: "home / house", partOfSpeech: "noun", kind: "word" },
  { surface: "出ます", reading: "でます", lemma: "出る", meaning: "leave / go out", partOfSpeech: "verb", kind: "word", grammarForm: "polite present" },
  { surface: "学校", reading: "がっこう", lemma: "学校", meaning: "school", partOfSpeech: "noun", kind: "word" },
  { surface: "今日", reading: "きょう", lemma: "今日", meaning: "today", partOfSpeech: "noun", kind: "word" },
  { surface: "いい", reading: "いい", lemma: "いい", meaning: "good", partOfSpeech: "adjective", kind: "word" },
  { surface: "は", reading: "は", lemma: "は", meaning: "topic marker", partOfSpeech: "particle", kind: "particle" },
  { surface: "を", reading: "を", lemma: "を", meaning: "object marker", partOfSpeech: "particle", kind: "particle" },
  { surface: "に", reading: "に", lemma: "に", meaning: "time / location marker", partOfSpeech: "particle", kind: "particle" },
  { surface: "へ", reading: "へ", lemma: "へ", meaning: "direction marker", partOfSpeech: "particle", kind: "particle" },
  { surface: "と", reading: "と", lemma: "と", meaning: "with / and", partOfSpeech: "particle", kind: "particle" },
  { surface: "で", reading: "で", lemma: "で", meaning: "at / by means of", partOfSpeech: "particle", kind: "particle" },
  { surface: "の", reading: "の", lemma: "の", meaning: "possessive / modifier", partOfSpeech: "particle", kind: "particle" },
  { surface: "も", reading: "も", lemma: "も", meaning: "also / too", partOfSpeech: "particle", kind: "particle" },
  { surface: "、", reading: "", lemma: "、", meaning: "comma", partOfSpeech: "punctuation", kind: "punctuation" },
  { surface: "。", reading: "", lemma: "。", meaning: "period", partOfSpeech: "punctuation", kind: "punctuation" },
];
