CREATE TABLE "game_feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" varchar(64) NOT NULL,
	"game_name" varchar(120) NOT NULL,
	"rating" integer NOT NULL,
	"source_path" varchar(200) NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_feedbacks" ENABLE ROW LEVEL SECURITY;