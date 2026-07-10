import { describe, expect, it } from "vitest";

import { gameFeedbackInputSchema } from "@/features/game-analytics/model/game-feedback-validation";

const validGameFeedback = {
  gameId: "random-draw",
  gameName: "랜덤 뽑기",
  rating: 5,
  sourcePath: "/games/random-draw",
};

describe("gameFeedbackInputSchema", () => {
  it("1점부터 5점까지의 정수 평가를 허용한다", () => {
    expect(gameFeedbackInputSchema.safeParse(validGameFeedback).success).toBe(
      true,
    );
  });

  it("5점을 초과하는 평가를 거부한다", () => {
    const result = gameFeedbackInputSchema.safeParse({
      ...validGameFeedback,
      rating: 6,
    });

    expect(result.success).toBe(false);
  });

  it("정수가 아닌 평가를 거부한다", () => {
    const result = gameFeedbackInputSchema.safeParse({
      ...validGameFeedback,
      rating: 3.5,
    });

    expect(result.success).toBe(false);
  });
});
