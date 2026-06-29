CREATE TYPE "public"."event_category" AS ENUM('meeting', 'work', 'personal', 'focus');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('planned', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" "event_status" DEFAULT 'planned' NOT NULL,
	"category" "event_category" DEFAULT 'work' NOT NULL,
	"location" text,
	"is_all_day" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
