import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { EVENT_CATEGORIES, EVENT_STATUSES } from "../model/events";

export const eventStatus = pgEnum("event_status", EVENT_STATUSES);
export const eventCategory = pgEnum("event_category", EVENT_CATEGORIES);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  status: eventStatus("status").default("planned").notNull(),
  category: eventCategory("category").default("work").notNull(),
  location: text("location"),
  isAllDay: boolean("is_all_day").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();
