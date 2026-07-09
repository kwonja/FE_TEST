import { z } from "zod";

export const gameClickEventInputSchema = z.object({
  gameId: z.string().trim().min(1).max(64),
  gameName: z.string().trim().min(1).max(120),
  sourcePath: z.string().trim().min(1).max(200),
  userAgent: z.string().trim().max(500).optional(),
  clickedAt: z.string().datetime({ offset: true }).optional(),
});

