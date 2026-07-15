CREATE TYPE "public"."account_role" AS ENUM('free', 'premium');--> statement-breakpoint
CREATE TABLE "ai_usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"text_id" uuid,
	"sentence_id" uuid,
	"cached" boolean DEFAULT false NOT NULL,
	"model" varchar(80),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "account_role" "account_role" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "texts" ADD COLUMN "header_image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_text_id_texts_id_fk" FOREIGN KEY ("text_id") REFERENCES "public"."texts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_sentence_id_text_sentences_id_fk" FOREIGN KEY ("sentence_id") REFERENCES "public"."text_sentences"("id") ON DELETE set null ON UPDATE no action;