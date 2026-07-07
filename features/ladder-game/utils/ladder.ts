import {
  MAX_LADDER_PLAYERS,
  MIN_LADDER_PLAYERS,
  type Ladder,
  type LadderBridge,
  type LadderMovement,
  type LadderRoutePoint,
} from "../model/ladder";

const BRIDGE_CREATION_PROBABILITY = 0.6;

const createSeededRandom = (seed: number) => {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };
};

const assertPlayerCount = (playerCount: number) => {
  if (
    !Number.isInteger(playerCount) ||
    playerCount < MIN_LADDER_PLAYERS ||
    playerCount > MAX_LADDER_PLAYERS
  ) {
    throw new Error(
      `참가자 수는 ${MIN_LADDER_PLAYERS}명에서 ${MAX_LADDER_PLAYERS}명 사이여야 합니다.`,
    );
  }
};

export const generateLadder = (playerCount: number, seed: number): Ladder => {
  assertPlayerCount(playerCount);

  const random = createSeededRandom(seed);
  const rowCount = Math.ceil(playerCount * 1.5);
  const bridges: LadderBridge[] = [];

  for (let row = 1; row < rowCount; row += 1) {
    for (let leftColumn = 0; leftColumn < playerCount - 1; leftColumn += 1) {
      if (random() < BRIDGE_CREATION_PROBABILITY) {
        bridges.push({ row, leftColumn });
        leftColumn += 1;
      }
    }
  }

  if (bridges.length === 0) {
    bridges.push({ row: Math.ceil(rowCount / 2), leftColumn: 0 });
  }

  return {
    playerCount,
    rowCount,
    bridges,
    seed,
  };
};

export const createLadderMovements = (
  ladder: Ladder,
  startColumn: number,
): LadderMovement[] => {
  if (startColumn < 0 || startColumn >= ladder.playerCount) {
    throw new Error("유효하지 않은 시작 위치입니다.");
  }

  const movements: LadderMovement[] = [];
  let currentPoint: LadderRoutePoint = { row: 0, column: startColumn };
  let currentColumn = startColumn;

  for (let row = 1; row <= ladder.rowCount; row += 1) {
    const verticalDestination = { row, column: currentColumn };
    movements.push({
      type: "vertical",
      from: currentPoint,
      to: verticalDestination,
    });
    currentPoint = verticalDestination;

    const bridgeToRight = ladder.bridges.some(
      (bridge) =>
        bridge.row === row && bridge.leftColumn === currentColumn,
    );
    const bridgeToLeft = ladder.bridges.some(
      (bridge) =>
        bridge.row === row && bridge.leftColumn === currentColumn - 1,
    );
    const nextColumn = bridgeToRight
      ? currentColumn + 1
      : bridgeToLeft
        ? currentColumn - 1
        : currentColumn;

    if (currentColumn !== nextColumn) {
      const bridgeDestination = { row, column: nextColumn };
      movements.push({
        type: "bridge",
        from: currentPoint,
        to: bridgeDestination,
      });
      currentPoint = bridgeDestination;
    }

    currentColumn = nextColumn;
  }

  return movements;
};

export const getLadderDestination = (
  ladder: Ladder,
  startColumn: number,
): number => {
  const movements = createLadderMovements(ladder, startColumn);
  return movements.at(-1)?.to.column ?? startColumn;
};

export const createLadderRoute = (
  ladder: Ladder,
  startColumn: number,
): LadderRoutePoint[] => {
  const movements = createLadderMovements(ladder, startColumn);

  return [
    { row: 0, column: startColumn },
    ...movements.map((movement) => movement.to),
  ];
};
