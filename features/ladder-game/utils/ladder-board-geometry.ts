import type { Ladder, LadderRoutePoint } from "../model/ladder";

export type BoardSize = {
  width: number;
  height: number;
};

export type BoardPoint = {
  x: number;
  y: number;
};

export const getBoardSize = (ladder: Ladder, cellSize: number): BoardSize => {
  return {
    width: ladder.playerCount * cellSize,
    height: ladder.rowCount * cellSize,
  };
};

export const getPointPosition = (
  point: LadderRoutePoint,
  cellSize: number,
): BoardPoint => {
  return {
    x: (point.column + 0.5) * cellSize,
    y: point.row * cellSize,
  };
};

export const createPath = (
  points: LadderRoutePoint[],
  cellSize: number,
) => {
  return points
    .map((point, index) => {
      const position = getPointPosition(point, cellSize);
      return `${index === 0 ? "M" : "L"} ${position.x} ${position.y}`;
    })
    .join(" ");
};
