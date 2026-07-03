import {
  MAX_LADDER_PLAYERS,
  MIN_LADDER_PLAYERS,
  type Ladder,
  type LadderBridge,
  type LadderRoutePoint,
  type LadderStep,
} from "../model/ladder";

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function assertPlayerCount(playerCount: number) {
  if (
    !Number.isInteger(playerCount) ||
    playerCount < MIN_LADDER_PLAYERS ||
    playerCount > MAX_LADDER_PLAYERS
  ) {
    throw new Error(
      `참가자 수는 ${MIN_LADDER_PLAYERS}명에서 ${MAX_LADDER_PLAYERS}명 사이여야 합니다.`,
    );
  }
}

export function generateLadder(playerCount: number, seed: number): Ladder {
  assertPlayerCount(playerCount);

  const random = createSeededRandom(seed);
  const levelCount = playerCount;
  const bridges: LadderBridge[] = [];

  for (let level = 0; level < levelCount - 1; level += 1) {
    for (let leftColumn = 0; leftColumn < playerCount - 1; leftColumn += 1) {
      if (random() < 0.42) {
        bridges.push({ level, leftColumn });
        leftColumn += 1;
      }
    }
  }

  if (bridges.length === 0) {
    bridges.push({ level: Math.floor((levelCount - 1) / 2), leftColumn: 0 });
  }

  return {
    playerCount,
    levelCount,
    bridges,
    seed,
  };
}

export function traceLadder(ladder: Ladder, startColumn: number): LadderStep[] {
  if (startColumn < 0 || startColumn >= ladder.playerCount) {
    throw new Error("유효하지 않은 시작 위치입니다.");
  }

  const steps: LadderStep[] = [];
  let currentColumn = startColumn;

  for (let level = 0; level < ladder.levelCount; level += 1) {
    const bridgeToRight = ladder.bridges.some(
      (bridge) =>
        bridge.level === level && bridge.leftColumn === currentColumn,
    );
    const bridgeToLeft = ladder.bridges.some(
      (bridge) =>
        bridge.level === level && bridge.leftColumn === currentColumn - 1,
    );
    const nextColumn = bridgeToRight
      ? currentColumn + 1
      : bridgeToLeft
        ? currentColumn - 1
        : currentColumn;

    steps.push({
      level,
      fromColumn: currentColumn,
      toColumn: nextColumn,
    });
    currentColumn = nextColumn;
  }

  return steps;
}

export function getLadderDestination(
  ladder: Ladder,
  startColumn: number,
): number {
  const steps = traceLadder(ladder, startColumn);
  return steps.at(-1)?.toColumn ?? startColumn;
}

export function createLadderRoute(
  ladder: Ladder,
  startColumn: number,
): LadderRoutePoint[] {
  const route: LadderRoutePoint[] = [{ row: 0, column: startColumn }];

  for (const step of traceLadder(ladder, startColumn)) {
    const row = step.level + 1;
    route.push({ row, column: step.fromColumn });

    if (step.fromColumn !== step.toColumn) {
      route.push({ row, column: step.toColumn });
    }
  }

  return route;
}
