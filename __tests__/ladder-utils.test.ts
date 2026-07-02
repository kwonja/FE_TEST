import { describe, expect, it } from "vitest";

import {
  createLadderRoute,
  generateLadder,
  getLadderDestination,
} from "@/features/ladder-game/utils/ladder";

describe("사다리 계산", () => {
  it("같은 시드로 같은 사다리를 생성한다", () => {
    expect(generateLadder(4, 20260702)).toEqual(
      generateLadder(4, 20260702),
    );
  });

  it("같은 높이에 서로 맞닿는 가로선을 만들지 않는다", () => {
    const ladder = generateLadder(8, 77);

    for (let level = 0; level < ladder.levelCount; level += 1) {
      const columns = ladder.bridges
        .filter((bridge) => bridge.level === level)
        .map((bridge) => bridge.leftColumn);

      expect(
        columns.some((column) => columns.includes(column + 1)),
      ).toBe(false);
    }
  });

  it("모든 참가자를 서로 다른 결과에 연결한다", () => {
    const ladder = generateLadder(10, 99);
    const destinations = Array.from({ length: 10 }, (_, index) =>
      getLadderDestination(ladder, index),
    );

    expect(new Set(destinations).size).toBe(10);
    expect(destinations.toSorted()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("경로를 상하좌우 한 칸 단위 좌표로 만든다", () => {
    const ladder = generateLadder(4, 20260702);
    const route = createLadderRoute(ladder, 0);

    for (let index = 1; index < route.length; index += 1) {
      const rowDistance = Math.abs(route[index].row - route[index - 1].row);
      const columnDistance = Math.abs(
        route[index].column - route[index - 1].column,
      );

      expect(rowDistance + columnDistance).toBe(1);
    }

    expect(route.at(-1)?.column).toBe(getLadderDestination(ladder, 0));
  });
});
