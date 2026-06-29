import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eventInputSchema } from "@/lib/events-validation";

export async function GET() {
  try {
    const eventList = await db.select().from(events).orderBy(asc(events.startAt));

    return Response.json(eventList);
  } catch {
    return Response.json(
      { message: "일정을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = eventInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." },
      { status: 400 },
    );
  }

  try {
    const [createdEvent] = await db
      .insert(events)
      .values({
        ...parsed.data,
        description: parsed.data.description || null,
        location: parsed.data.location || null,
        startAt: new Date(parsed.data.startAt),
        endAt: new Date(parsed.data.endAt),
      })
      .returning();

    return Response.json(createdEvent, { status: 201 });
  } catch {
    return Response.json(
      { message: "일정을 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
