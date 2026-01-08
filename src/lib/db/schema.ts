import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Overlay “series” (group) like: dayerema, shipwrecked, etc.
 */
export const overlaySeries = pgTable(
  "overlay_series",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("overlay_series_slug_idx").on(t.slug),
  }),
);

/**
 * One overlay asset belonging to a series.
 * For V1 we store a public URL (can be S3/R2 or a Next route).
 */
export const overlays = pgTable(
  "overlays",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    seriesId: uuid("series_id")
      .notNull()
      .references(() => overlaySeries.id, { onDelete: "cascade" }),

    slug: text("slug").notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),

    // optional short “placement” hint (e.g. "top-left" for corner overlays)
    placement: text("placement"),

    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("overlays_series_slug_idx").on(t.seriesId, t.slug),
  }),
);

/**
 * Optional: store Slack identity to support “Apply to Slack” and always fetch latest PFP.
 */
export const slackUsers = pgTable(
  "slack_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: text("team_id").notNull(),
    userId: text("user_id").notNull(),

    accessToken: text("access_token").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("slack_users_team_user_idx").on(t.teamId, t.userId),
  }),
);
