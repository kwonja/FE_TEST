import { eq } from "drizzle-orm";

import { eventInputSchema } from "@/features/schedule/model/events-validation";
import { db } from "@/features/schedule/server/db";
import { events } from "@/features/schedule/server/schema";

type EventRouteContext = {
  params: Promise<{ id: string }>;
};

function parseEventId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: EventRouteContext) {
  const { id: rawId } = await context.params;
  const id = parseEventId(rawId);

  if (!id) {
    return Response.json({ message: "잘못된 일정 ID입니다." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = eventInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." },
      { status: 400 },
    );
  }

  try {
    const [updatedEvent] = await db
      .update(events)
      .set({
        ...parsed.data,
        description: parsed.data.description || null,
        location: parsed.data.location || null,
        startAt: new Date(parsed.data.startAt),
        endAt: new Date(parsed.data.endAt),
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    if (!updatedEvent) {
      return Response.json(
        { message: "일정을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return Response.json(updatedEvent);
  } catch {
    return Response.json(
      { message: "일정을 수정하지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: EventRouteContext) {
  const { id: rawId } = await context.params;
  const id = parseEventId(rawId);

  if (!id) {
    return Response.json({ message: "잘못된 일정 ID입니다." }, { status: 400 });
  }

  try {
    const [deletedEvent] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });

    if (!deletedEvent) {
      return Response.json(
        { message: "일정을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { message: "일정을 삭제하지 못했습니다." },
      { status: 500 },
    );
  }
}
