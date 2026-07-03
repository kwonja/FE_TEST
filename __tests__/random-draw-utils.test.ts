import { describe, expect, it } from "vitest";

import { drawRandomNumber } from "@/features/random-draw/utils/draw-random-number";

describe("drawRandomNumber", () => {
  it("주입한 난수 함수로 양 끝값을 포함해 정수를 만든다", () => {
    expect(drawRandomNumber(1, 100, () => 0)).toBe(1);
    expect(drawRandomNumber(1, 100, () => 0.999999)).toBe(100);
  });

  it("잘못된 범위를 거부한다", () => {
    expect(() => drawRandomNumber(10, 1, () => 0.5)).toThrow(RangeError);
  });
});
