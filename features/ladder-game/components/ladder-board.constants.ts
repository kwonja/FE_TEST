export const CELL_SIZE = 72;
export const STEP_DURATION_MS = 120;
export const MAX_ROUTE_DURATION_MS = 1200;
export const BOARD_VERTICAL_INSET = 20;

export const PLAYER_STYLES = [
  { stroke: "var(--player-1)", foreground: "text-white" },
  { stroke: "var(--player-2)", foreground: "text-game-ink" },
  { stroke: "var(--player-3)", foreground: "text-white" },
  { stroke: "var(--player-4)", foreground: "text-game-ink" },
  { stroke: "var(--player-5)", foreground: "text-game-ink" },
  { stroke: "var(--player-6)", foreground: "text-white" },
  { stroke: "var(--player-7)", foreground: "text-white" },
  { stroke: "var(--player-8)", foreground: "text-white" },
  { stroke: "var(--player-9)", foreground: "text-white" },
  { stroke: "var(--player-10)", foreground: "text-white" },
] as const;

export type PlayerStyle = (typeof PLAYER_STYLES)[number];
