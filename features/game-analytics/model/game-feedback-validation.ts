import { z } from "zod";

export const gameFeedbackInputSchema = z.object({
  gameId: z.string().trim().min(1).max(64),
  gameName: z.string().trim().min(1).max(120),
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  sourcePath: z.string().trim().min(1).max(200),
  userAgent: z.string().trim().max(500).optional(),
});
