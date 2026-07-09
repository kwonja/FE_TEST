CREATE TABLE "game_click_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" varchar(64) NOT NULL,
	"game_name" varchar(120) NOT NULL,
	"source_path" varchar(200) NOT NULL,
	"user_agent" text,
	"clicked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_click_events" ENABLE ROW LEVEL SECURITY;