import { afterEach, describe, expect, it, vi } from "vitest";

import {
  recordGameFeedbackDismissed,
  recordGameFeedbackRated,
  recordGamePlayed,
} from "@/features/game-analytics/client/game-feedback-state";

describe("game feedback local state", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("같은 게임을 두 번 플레이하면 평가 모달 노출 조건을 만족한다", () => {
    expect(recordGamePlayed("random-draw")).toBe(false);
    expect(recordGamePlayed("random-draw")).toBe(true);
  });

  it("나중에 누르면 하루 동안 다시 노출하지 않는다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-09T09:00:00.000Z"));

    recordGamePlayed("random-draw");
    expect(recordGamePlayed("random-draw")).toBe(true);
    recordGameFeedbackDismissed("random-draw");

    expect(recordGamePlayed("random-draw")).toBe(false);

    vi.setSystemTime(new Date("2026-07-10T09:00:01.000Z"));

    expect(recordGamePlayed("random-draw")).toBe(true);
  });

  it("평가를 완료하면 카운트를 초기화하고 두 번 더 플레이한 뒤 다시 노출한다", () => {
    recordGamePlayed("random-draw");
    expect(recordGamePlayed("random-draw")).toBe(true);
    recordGameFeedbackRated("random-draw");

    expect(recordGamePlayed("random-draw")).toBe(false);
    expect(recordGamePlayed("random-draw")).toBe(true);
  });
});
