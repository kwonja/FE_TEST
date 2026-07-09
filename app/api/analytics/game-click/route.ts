import { gameClickEventInputSchema } from "@/features/game-analytics/model/game-click-event-validation";
import { gameClickEventRepository } from "@/features/game-analytics/server/repositories/game-click-event-repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requestBody = typeof body === "object" && body !== null ? body : {};
  const parsed = gameClickEventInputSchema.safeParse({
    ...requestBody,
    userAgent:
      "userAgent" in requestBody && typeof requestBody.userAgent === "string"
        ? requestBody.userAgent
        : (request.headers.get("user-agent") ?? undefined),
  });

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." },
      { status: 400 },
    );
  }

  try {
    const createdEvent = await gameClickEventRepository.create(parsed.data);

    return Response.json(createdEvent, { status: 201 });
  } catch {
    return Response.json(
      { message: "게임 클릭 이벤트를 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
