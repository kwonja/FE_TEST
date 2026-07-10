import { describe, expect, it } from "vitest";

import {
  formatTimerSeconds,
  getTimerDifference,
  getTimerResultMessage,
} from "@/features/seven-seven-timer/utils/seven-seven-timer";

describe("seven-seven timer utils", () => {
  it("초 단위 시간을 소수점 두 자리로 표시한다", () => {
    expect(formatTimerSeconds(7.777)).toBe("7.78s");
  });

  it("목표 시간과의 절대 오차를 계산한다", () => {
    expect(getTimerDifference(7.5)).toBeCloseTo(0.27);
    expect(getTimerDifference(8.04)).toBeCloseTo(0.27);
  });

  it("결과 오차와 시간에 맞는 안내 문구를 만든다", () => {
    expect(getTimerResultMessage(7.77)).toContain("완벽합니다");
    expect(getTimerResultMessage(7.7)).toContain("거의 다");
    expect(getTimerResultMessage(7)).toContain("일렀어요");
    expect(getTimerResultMessage(8)).toContain("늦었어요");
  });
});
