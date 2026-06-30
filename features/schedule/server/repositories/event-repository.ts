import { asc, eq } from "drizzle-orm";

import type { EventInput } from "../../model/events";
import { db } from "../db";
import { events } from "../schema";

function toEventValues(input: EventInput) {
  return {
    ...input,
    description: input.description || null,
    location: input.location || null,
    startAt: new Date(input.startAt),
    endAt: new Date(input.endAt),
  };
}

export const eventRepository = {
  findAll() {
    return db.select().from(events).orderBy(asc(events.startAt));
  },

  async create(input: EventInput) {
    const [createdEvent] = await db
      .insert(events)
      .values(toEventValues(input))
      .returning();

    return createdEvent ?? null;
  },

  async updateById(id: number, input: EventInput) {
    const [updatedEvent] = await db
      .update(events)
      .set({
        ...toEventValues(input),
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    return updatedEvent ?? null;
  },

  async deleteById(id: number) {
    const [deletedEvent] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });

    return deletedEvent ?? null;
  },
};
