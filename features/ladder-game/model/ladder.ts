export const MIN_LADDER_PLAYERS = 3;
export const MAX_LADDER_PLAYERS = 10;

export type LadderBridge = {
  level: number;
  leftColumn: number;
};

export type Ladder = {
  playerCount: number;
  levelCount: number;
  bridges: LadderBridge[];
  seed: number;
};

export type LadderStep = {
  level: number;
  fromColumn: number;
  toColumn: number;
};

export type LadderRoutePoint = {
  row: number;
  column: number;
};

export type LadderGameSnapshot = {
  participants: string[];
  results: string[];
  ladder: Ladder;
};
