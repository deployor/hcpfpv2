CREATE TYPE "public"."content_type_enum" AS ENUM('sticker', 'overlay');--> statement-breakpoint
CREATE TYPE "public"."submission_status_enum" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."submission_type_enum" AS ENUM('new', 'existing');--> statement-breakpoint
CREATE TABLE "shared_compositions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"stickers" jsonb NOT NULL,
	"overlays" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sticker_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"preview_image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "stickers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"credits" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "style_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"preview_image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "style_overlays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"style_id" uuid NOT NULL,
	"name" text NOT NULL,
	"overlay_path" text NOT NULL,
	"credits" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"created_by" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" text NOT NULL,
	"submission_type" text NOT NULL,
	"target_name" text NOT NULL,
	"target_id" uuid,
	"submitted_by" text NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now(),
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"review_notes" text,
	"files" jsonb NOT NULL,
	"user_pfp" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "stickers" ADD CONSTRAINT "stickers_category_id_sticker_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."sticker_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_overlays" ADD CONSTRAINT "style_overlays_style_id_style_categories_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."style_categories"("id") ON DELETE cascade ON UPDATE no action;