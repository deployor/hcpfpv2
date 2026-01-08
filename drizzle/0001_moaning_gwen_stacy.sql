ALTER TABLE "stickers" DROP CONSTRAINT "stickers_category_id_sticker_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "style_overlays" DROP CONSTRAINT "style_overlays_style_id_style_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "stickers" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "stickers" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "overlays" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shared_compositions" ALTER COLUMN "overlays" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "preview_image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sticker_categories" ALTER COLUMN "sort_order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "category_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stickers" ALTER COLUMN "sort_order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "preview_image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_categories" ALTER COLUMN "sort_order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "style_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "style_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "overlay_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "created_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "style_overlays" ALTER COLUMN "sort_order" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "content_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "submission_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "target_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "target_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "submitted_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "submitted_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "submitted_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "reviewed_at" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "files" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "files" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "created_at" DROP DEFAULT;