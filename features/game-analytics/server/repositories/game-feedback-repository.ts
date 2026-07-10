import { db } from "@/shared/server/database";

import type { GameFeedbackInput } from "../../model/game-feedback";
import { gameFeedbacks } from "../schema";

const toGameFeedbackValues = (input: GameFeedbackInput) => {
  return {
    gameId: input.gameId,
    gameName: input.gameName,
    rating: input.rating,
    sourcePath: input.sourcePath,
    userAgent: input.userAgent || null,
  };
};

export const gameFeedbackRepository = {
  create: async (input: GameFeedbackInput) => {
    const [createdFeedback] = await db
      .insert(gameFeedbacks)
      .values(toGameFeedbackValues(input))
      .returning();

    return createdFeedback ?? null;
  },
};
