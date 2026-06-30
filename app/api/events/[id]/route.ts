import { eventInputSchema } from "@/features/schedule/model/events-validation";
import { eventRepository } from "@/features/schedule/server/repositories/event-repository";

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
    const updatedEvent = await eventRepository.updateById(id, parsed.data);

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
    const deletedEvent = await eventRepository.deleteById(id);

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
