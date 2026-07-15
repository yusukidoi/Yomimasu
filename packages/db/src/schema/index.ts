import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const jlptLevelEnum = pgEnum("jlpt_level", ["N5", "N4", "N3"]);

export const textStatusEnum = pgEnum("text_status", [
  "draft",
  "published",
  "archived",
]);

export const wordStatusEnum = pgEnum("word_status", [
  "unseen",
  "read",
  "saved",
  "known",
]);

export const tokenKindEnum = pgEnum("token_kind", [
  "word",
  "particle",
  "punctuation",
  "other",
]);

export const accountRoleEnum = pgEnum("account_role", ["free", "premium"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

/**
 * App profile linked to Supabase Auth `auth.users.id`.
 * No FK to auth.users here so local Postgres without Supabase still works.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 320 }),
  displayName: varchar("display_name", { length: 120 }),
  jlptLevel: jlptLevelEnum("jlpt_level").notNull().default("N5"),
  accountRole: accountRoleEnum("account_role").notNull().default("free"),
  isAdmin: boolean("is_admin").notNull().default(false),
  readingStreakDays: integer("reading_streak_days").notNull().default(0),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }),
  ...timestamps,
});

export const texts = pgTable(
  "texts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    titleJa: varchar("title_ja", { length: 200 }),
    level: jlptLevelEnum("level").notNull().default("N5"),
    topic: varchar("topic", { length: 80 }),
    summary: text("summary"),
    body: text("body").notNull(),
    translationEn: text("translation_en"),
    headerImageUrl: varchar("header_image_url", { length: 500 }),
    status: textStatusEnum("status").notNull().default("draft"),
    isFree: boolean("is_free").notNull().default(false),
    estimatedMinutes: integer("estimated_minutes").notNull().default(5),
    wordCount: integer("word_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("texts_slug_uidx").on(table.slug)],
);

export const textSentences = pgTable("text_sentences", {
  id: uuid("id").primaryKey().defaultRandom(),
  textId: uuid("text_id")
    .notNull()
    .references(() => texts.id, { onDelete: "cascade" }),
  index: integer("index").notNull(),
  surface: text("surface").notNull(),
  translationEn: text("translation_en"),
  ...timestamps,
});

export const dictionaryEntries = pgTable(
  "dictionary_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lemma: text("lemma").notNull(),
    reading: text("reading"),
    partOfSpeech: varchar("part_of_speech", { length: 80 }),
    meanings: jsonb("meanings").$type<string[]>().notNull().default([]),
    estimatedLevel: jlptLevelEnum("estimated_level"),
    source: varchar("source", { length: 40 }).notNull().default("jmdict"),
    externalId: varchar("external_id", { length: 80 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("dictionary_entries_source_external_uidx").on(
      table.source,
      table.externalId,
    ),
  ],
);

export const kanjiEntries = pgTable(
  "kanji_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    character: varchar("character", { length: 8 }).notNull(),
    meanings: jsonb("meanings").$type<string[]>().notNull().default([]),
    onyomi: jsonb("onyomi").$type<string[]>().notNull().default([]),
    kunyomi: jsonb("kunyomi").$type<string[]>().notNull().default([]),
    estimatedLevel: jlptLevelEnum("estimated_level"),
    strokeCount: integer("stroke_count"),
    ...timestamps,
  },
  (table) => [uniqueIndex("kanji_entries_character_uidx").on(table.character)],
);

export const textPhrases = pgTable("text_phrases", {
  id: uuid("id").primaryKey().defaultRandom(),
  textId: uuid("text_id")
    .notNull()
    .references(() => texts.id, { onDelete: "cascade" }),
  surface: text("surface").notNull(),
  reading: text("reading"),
  meaning: text("meaning"),
  explanation: text("explanation"),
  startTokenIndex: integer("start_token_index").notNull(),
  endTokenIndex: integer("end_token_index").notNull(),
  ...timestamps,
});

export const textTokens = pgTable("text_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  textId: uuid("text_id")
    .notNull()
    .references(() => texts.id, { onDelete: "cascade" }),
  sentenceId: uuid("sentence_id").references(() => textSentences.id, {
    onDelete: "set null",
  }),
  index: integer("index").notNull(),
  surface: text("surface").notNull(),
  lemma: text("lemma"),
  reading: text("reading"),
  partOfSpeech: varchar("part_of_speech", { length: 80 }),
  kind: tokenKindEnum("kind").notNull().default("word"),
  meaning: text("meaning"),
  meaningOverride: text("meaning_override"),
  grammarForm: varchar("grammar_form", { length: 120 }),
  estimatedLevel: jlptLevelEnum("estimated_level"),
  dictionaryEntryId: uuid("dictionary_entry_id").references(
    () => dictionaryEntries.id,
    { onDelete: "set null" },
  ),
  phraseId: uuid("phrase_id").references(() => textPhrases.id, {
    onDelete: "set null",
  }),
  ...timestamps,
});

export const userVocabulary = pgTable(
  "user_vocabulary",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    dictionaryEntryId: uuid("dictionary_entry_id").references(
      () => dictionaryEntries.id,
      { onDelete: "set null" },
    ),
    surface: text("surface").notNull(),
    lemma: text("lemma"),
    reading: text("reading"),
    meaning: text("meaning"),
    status: wordStatusEnum("status").notNull().default("saved"),
    sourceTextId: uuid("source_text_id").references(() => texts.id, {
      onDelete: "set null",
    }),
    firstSentence: text("first_sentence"),
    timesRead: integer("times_read").notNull().default(0),
    timesClicked: integer("times_clicked").notNull().default(0),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("user_vocabulary_user_surface_lemma_uidx").on(
      table.userId,
      table.surface,
      table.lemma,
    ),
  ],
);

export const readingSessions = pgTable("reading_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  textId: uuid("text_id")
    .notNull()
    .references(() => texts.id, { onDelete: "cascade" }),
  secondsRead: integer("seconds_read").notNull().default(0),
  knownWordPercent: integer("known_word_percent"),
  newWordCount: integer("new_word_count").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  lastParagraphIndex: integer("last_paragraph_index").notNull().default(0),
  ...timestamps,
});

export const aiExplanations = pgTable(
  "ai_explanations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    textId: uuid("text_id").references(() => texts.id, { onDelete: "cascade" }),
    sentenceId: uuid("sentence_id").references(() => textSentences.id, {
      onDelete: "cascade",
    }),
    sentenceSurface: text("sentence_surface").notNull(),
    selectedTokenSurface: text("selected_token_surface"),
    userLevel: jlptLevelEnum("user_level").notNull().default("N5"),
    response: jsonb("response").notNull(),
    model: varchar("model", { length: 80 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("ai_explanations_cache_uidx").on(
      table.sentenceSurface,
      table.selectedTokenSurface,
      table.userLevel,
    ),
  ],
);

export const aiUsageEvents = pgTable("ai_usage_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  textId: uuid("text_id").references(() => texts.id, { onDelete: "set null" }),
  sentenceId: uuid("sentence_id").references(() => textSentences.id, {
    onDelete: "set null",
  }),
  cached: boolean("cached").notNull().default(false),
  model: varchar("model", { length: 80 }),
  ...timestamps,
});
