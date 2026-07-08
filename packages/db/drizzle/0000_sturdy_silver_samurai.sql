CREATE TYPE "public"."jlpt_level" AS ENUM('N5', 'N4', 'N3');--> statement-breakpoint
CREATE TYPE "public"."text_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."token_kind" AS ENUM('word', 'particle', 'punctuation', 'other');--> statement-breakpoint
CREATE TYPE "public"."word_status" AS ENUM('unseen', 'read', 'saved', 'known');--> statement-breakpoint
CREATE TABLE "ai_explanations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text_id" uuid,
	"sentence_id" uuid,
	"sentence_surface" text NOT NULL,
	"selected_token_surface" text,
	"user_level" "jlpt_level" DEFAULT 'N5' NOT NULL,
	"response" jsonb NOT NULL,
	"model" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dictionary_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lemma" text NOT NULL,
	"reading" text,
	"part_of_speech" varchar(80),
	"meanings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_level" "jlpt_level",
	"source" varchar(40) DEFAULT 'jmdict' NOT NULL,
	"external_id" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanji_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character" varchar(8) NOT NULL,
	"meanings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"onyomi" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"kunyomi" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_level" "jlpt_level",
	"stroke_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(320),
	"display_name" varchar(120),
	"jlpt_level" "jlpt_level" DEFAULT 'N5' NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"reading_streak_days" integer DEFAULT 0 NOT NULL,
	"last_read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"text_id" uuid NOT NULL,
	"seconds_read" integer DEFAULT 0 NOT NULL,
	"known_word_percent" integer,
	"new_word_count" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"last_paragraph_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_phrases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text_id" uuid NOT NULL,
	"surface" text NOT NULL,
	"reading" text,
	"meaning" text,
	"explanation" text,
	"start_token_index" integer NOT NULL,
	"end_token_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_sentences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text_id" uuid NOT NULL,
	"index" integer NOT NULL,
	"surface" text NOT NULL,
	"translation_en" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text_id" uuid NOT NULL,
	"sentence_id" uuid,
	"index" integer NOT NULL,
	"surface" text NOT NULL,
	"lemma" text,
	"reading" text,
	"part_of_speech" varchar(80),
	"kind" "token_kind" DEFAULT 'word' NOT NULL,
	"meaning" text,
	"meaning_override" text,
	"grammar_form" varchar(120),
	"estimated_level" "jlpt_level",
	"dictionary_entry_id" uuid,
	"phrase_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"title_ja" varchar(200),
	"level" "jlpt_level" DEFAULT 'N5' NOT NULL,
	"topic" varchar(80),
	"summary" text,
	"body" text NOT NULL,
	"translation_en" text,
	"status" text_status DEFAULT 'draft' NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"estimated_minutes" integer DEFAULT 5 NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"dictionary_entry_id" uuid,
	"surface" text NOT NULL,
	"lemma" text,
	"reading" text,
	"meaning" text,
	"status" "word_status" DEFAULT 'saved' NOT NULL,
	"source_text_id" uuid,
	"first_sentence" text,
	"times_read" integer DEFAULT 0 NOT NULL,
	"times_clicked" integer DEFAULT 0 NOT NULL,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_explanations" ADD CONSTRAINT "ai_explanations_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_explanations" ADD CONSTRAINT "ai_explanations_sentence_id_text_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."text_sentences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_phrases" ADD CONSTRAINT "text_phrases_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_sentences" ADD CONSTRAINT "text_sentences_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_tokens" ADD CONSTRAINT "text_tokens_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_tokens" ADD CONSTRAINT "text_tokens_sentence_id_text_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."text_sentences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_tokens" ADD CONSTRAINT "text_tokens_dictionary_entry_id_dictionary_entries_id_fk" FOREIGN KEY ("dictionary_entry_id") REFERENCES "public"."dictionary_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_tokens" ADD CONSTRAINT "text_tokens_phrase_id_text_phrases_id_fk" FOREIGN KEY ("phrase_id") REFERENCES "public"."text_phrases"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_dictionary_entry_id_dictionary_entries_id_fk" FOREIGN KEY ("dictionary_entry_id") REFERENCES "public"."dictionary_entries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_source_text_id_texts_id_fk" FOREIGN KEY ("source_text_id") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ai_explanations_cache_uidx" ON "ai_explanations" USING btree ("sentence_surface","selected_token_surface","user_level");--> statement-breakpoint
CREATE UNIQUE INDEX "dictionary_entries_source_external_uidx" ON "dictionary_entries" USING btree ("source","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "kanji_entries_character_uidx" ON "kanji_entries" USING btree ("character");--> statement-breakpoint
CREATE UNIQUE INDEX "texts_slug_uidx" ON "texts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "user_vocabulary_user_surface_lemma_uidx" ON "user_vocabulary" USING btree ("user_id","surface","lemma");