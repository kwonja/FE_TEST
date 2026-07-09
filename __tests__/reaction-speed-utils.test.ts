import { describe, expect, it } from "vitest";

import {
  formatReactionTime,
  getRandomWaitDuration,
} from "@/features/reaction-speed/utils/reaction-speed";

describe("reaction-speed utils", () => {
  it("정수 범위 안에서 랜덤 대기 시간을 만든다", () => {
    expect(getRandomWaitDuration(1500, 5000, () => 0)).toBe(1500);
    expect(getRandomWaitDuration(1500, 5000, () => 0.999)).toBe(4997);
  });

  it("유효하지 않은 범위는 거부한다", () => {
    expect(() => getRandomWaitDuration(5000, 1500)).toThrow(RangeError);
    expect(() => getRandomWaitDuration(1.5, 10)).toThrow(RangeError);
  });

  it("반응속도를 ms 단위 문구로 표시한다", () => {
    expect(formatReactionTime(246.7)).toBe("247ms");
  });
});
