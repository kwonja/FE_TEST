import { describe, expect, it } from "vitest";

import {
  createLadderMovements,
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

  it.each([3, 4, 5, 10])(
    "참가자 %i명에서 인원수의 1.5배 행을 올림해 생성한다",
    (playerCount) => {
      expect(generateLadder(playerCount, 1).rowCount).toBe(
        Math.ceil(playerCount * 1.5),
      );
    },
  );

  it("같은 높이에 서로 맞닿는 가로선을 만들지 않는다", () => {
    const ladder = generateLadder(8, 77);

    for (let row = 1; row < ladder.rowCount; row += 1) {
      const columns = ladder.bridges
        .filter((bridge) => bridge.row === row)
        .map((bridge) => bridge.leftColumn);

      expect(
        columns.some((column) => columns.includes(column + 1)),
      ).toBe(false);
    }
  });

  it.each([3, 4, 8, 10])(
    "참가자 %i명의 마지막 행에는 가로선을 만들지 않고 이동 없이 추적한다",
    (playerCount) => {
      for (const seed of [0, 1, 77, 20260702]) {
        const ladder = generateLadder(playerCount, seed);

        expect(
          ladder.bridges.every(
            (bridge) => bridge.row < ladder.rowCount,
          ),
        ).toBe(true);

        for (let startColumn = 0; startColumn < playerCount; startColumn += 1) {
          const movements = createLadderMovements(ladder, startColumn);
          const verticalMovements = movements.filter(
            (movement) => movement.type === "vertical",
          );
          const lastMovement = movements.at(-1);

          expect(verticalMovements).toHaveLength(ladder.rowCount);
          expect(lastMovement?.type).toBe("vertical");
        }
      }
    },
  );

  it("가로선이 생성되지 않은 시드에서는 마지막 행 이전에 fallback을 만든다", () => {
    const ladder = generateLadder(3, 1742);

    expect(ladder.bridges).toEqual([
      {
        row: Math.ceil(ladder.rowCount / 2),
        leftColumn: 0,
      },
    ]);
    expect(ladder.bridges[0].row).toBeLessThan(ladder.rowCount);
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

  it("세로 이동과 브리지 이동을 연속된 개별 선분으로 만든다", () => {
    const ladder = generateLadder(4, 20260702);
    const movements = createLadderMovements(ladder, 0);

    for (let index = 0; index < movements.length; index += 1) {
      const movement = movements[index];
      const rowDistance = movement.to.row - movement.from.row;
      const columnDistance = Math.abs(
        movement.to.column - movement.from.column,
      );

      if (index > 0) {
        expect(movement.from).toEqual(movements[index - 1].to);
      }

      if (movement.type === "vertical") {
        expect(rowDistance).toBe(1);
        expect(columnDistance).toBe(0);
      } else {
        expect(rowDistance).toBe(0);
        expect(columnDistance).toBe(1);
      }
    }
  });
});
