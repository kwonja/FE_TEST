import { describe, expect, it } from "vitest";

import { gameClickEventInputSchema } from "@/features/game-analytics/model/game-click-event-validation";

const validGameClickEvent = {
  gameId: "random-draw",
  gameName: "1~100 랜덤 뽑기",
  sourcePath: "/",
};

describe("gameClickEventInputSchema", () => {
  it("올바른 게임 클릭 이벤트 입력을 허용한다", () => {
    expect(gameClickEventInputSchema.safeParse(validGameClickEvent).success).toBe(
      true,
    );
  });

  it("빈 게임 ID를 거부한다", () => {
    const result = gameClickEventInputSchema.safeParse({
      ...validGameClickEvent,
      gameId: "",
    });

    expect(result.success).toBe(false);
  });

  it("잘못된 클릭 시각을 거부한다", () => {
    const result = gameClickEventInputSchema.safeParse({
      ...validGameClickEvent,
      clickedAt: "2026-07-09",
    });

    expect(result.success).toBe(false);
  });
});
