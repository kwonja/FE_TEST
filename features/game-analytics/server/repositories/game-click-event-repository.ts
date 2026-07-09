import { db } from "@/shared/server/database";

import type { GameClickEventInput } from "../../model/game-click-event";
import { gameClickEvents } from "../schema";

const toGameClickEventValues = (input: GameClickEventInput) => {
  return {
    gameId: input.gameId,
    gameName: input.gameName,
    sourcePath: input.sourcePath,
    userAgent: input.userAgent || null,
    clickedAt: input.clickedAt ? new Date(input.clickedAt) : new Date(),
  };
};

export const gameClickEventRepository = {
  create: async (input: GameClickEventInput) => {
    const [createdEvent] = await db
      .insert(gameClickEvents)
      .values(toGameClickEventValues(input))
      .returning();

    return createdEvent ?? null;
  },
};

