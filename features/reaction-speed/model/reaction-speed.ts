export const REACTION_MIN_WAIT_MS = 1500;
export const REACTION_MAX_WAIT_MS = 5000;
export const REACTION_MAX_HISTORY = 5;

export type ReactionPhase =
  | "READY"
  | "WAITING"
  | "SIGNAL"
  | "RESULT"
  | "TOO_EARLY";
