"use client";

const GAME_FEEDBACK_STORAGE_KEY = "gameFeedbackState";
const PROMPT_AFTER_PLAY_COUNT = 2;
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface GameFeedbackStatus {
  playCount: number;
  rated: boolean;
  dismissedAt: string | null;
}

type GameFeedbackState = Record<string, GameFeedbackStatus>;

const createDefaultStatus = (): GameFeedbackStatus => {
  return {
    playCount: 0,
    rated: false,
    dismissedAt: null,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const normalizeStatus = (value: unknown): GameFeedbackStatus => {
  if (!isRecord(value)) {
    return createDefaultStatus();
  }

  return {
    playCount: typeof value.playCount === "number" ? value.playCount : 0,
    rated: value.rated === true,
    dismissedAt:
      typeof value.dismissedAt === "string" ? value.dismissedAt : null,
  };
};

const readGameFeedbackState = (): GameFeedbackState => {
  const rawState = window.localStorage.getItem(GAME_FEEDBACK_STORAGE_KEY);

  if (!rawState) {
    return {};
  }

  try {
    const parsedState: unknown = JSON.parse(rawState);

    if (!isRecord(parsedState)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedState).map(([gameId, status]) => [
        gameId,
        normalizeStatus(status),
      ]),
    );
  } catch {
    return {};
  }
};

const writeGameFeedbackState = (state: GameFeedbackState) => {
  window.localStorage.setItem(GAME_FEEDBACK_STORAGE_KEY, JSON.stringify(state));
};

const getGameFeedbackStatus = (
  state: GameFeedbackState,
  gameId: string,
): GameFeedbackStatus => {
  return state[gameId] ?? createDefaultStatus();
};

export const shouldShowGameFeedbackPrompt = (
  status: GameFeedbackStatus,
  now = Date.now(),
) => {
  if (status.rated || status.playCount < PROMPT_AFTER_PLAY_COUNT) {
    return false;
  }

  if (!status.dismissedAt) {
    return true;
  }

  return now - new Date(status.dismissedAt).getTime() >= DISMISS_COOLDOWN_MS;
};

export const recordGamePlayed = (gameId: string) => {
  const state = readGameFeedbackState();
  const currentStatus = getGameFeedbackStatus(state, gameId);
  const nextStatus = {
    ...currentStatus,
    playCount: currentStatus.playCount + 1,
  };

  writeGameFeedbackState({
    ...state,
    [gameId]: nextStatus,
  });

  return shouldShowGameFeedbackPrompt(nextStatus);
};

export const recordGameFeedbackDismissed = (gameId: string) => {
  const state = readGameFeedbackState();
  const currentStatus = getGameFeedbackStatus(state, gameId);

  writeGameFeedbackState({
    ...state,
    [gameId]: {
      ...currentStatus,
      dismissedAt: new Date().toISOString(),
    },
  });
};

export const recordGameFeedbackRated = (gameId: string) => {
  const state = readGameFeedbackState();
  const currentStatus = getGameFeedbackStatus(state, gameId);

  writeGameFeedbackState({
    ...state,
    [gameId]: {
      ...currentStatus,
      rated: true,
      dismissedAt: null,
    },
  });
};
