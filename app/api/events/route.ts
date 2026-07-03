import { eventInputSchema } from "@/features/schedule/model/events-validation";
import { eventRepository } from "@/features/schedule/server/repositories/event-repository";

export async function GET() {
  try {
    const eventList = await eventRepository.findAll();

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
    const createdEvent = await eventRepository.create(parsed.data);

    return Response.json(createdEvent, { status: 201 });
  } catch {
    return Response.json(
      { message: "일정을 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
