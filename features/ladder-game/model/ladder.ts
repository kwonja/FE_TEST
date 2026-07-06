export const MIN_LADDER_PLAYERS = 3;
export const MAX_LADDER_PLAYERS = 10;

export type LadderBridge = {
  row: number;
  leftColumn: number;
};

export type Ladder = {
  playerCount: number;
  rowCount: number;
  bridges: LadderBridge[];
  seed: number;
};

export type LadderRoutePoint = {
  row: number;
  column: number;
};

export type LadderMovement =
  | {
      type: "vertical";
      from: LadderRoutePoint;
      to: LadderRoutePoint;
    }
  | {
      type: "bridge";
      from: LadderRoutePoint;
      to: LadderRoutePoint;
    };

export type LadderGameSnapshot = {
  participants: string[];
  results: string[];
  ladder: Ladder;
};
