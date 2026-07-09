import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const gameClickEvents = pgTable("game_click_events", {
  id: serial("id").primaryKey(),
  gameId: varchar("game_id", { length: 64 }).notNull(),
  gameName: varchar("game_name", { length: 120 }).notNull(),
  sourcePath: varchar("source_path", { length: 200 }).notNull(),
  userAgent: text("user_agent"),
  clickedAt: timestamp("clicked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();

