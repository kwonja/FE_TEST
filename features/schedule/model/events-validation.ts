import { z } from "zod";

import { EVENT_CATEGORIES, EVENT_STATUSES } from "./events";

export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().max(1000).default(""),
    startAt: z.string().datetime({ offset: true }),
    endAt: z.string().datetime({ offset: true }),
    status: z.enum(EVENT_STATUSES),
    category: z.enum(EVENT_CATEGORIES),
    location: z.string().trim().max(200).default(""),
    isAllDay: z.boolean().default(false),
  })
  .refine((event) => new Date(event.endAt) > new Date(event.startAt), {
    message: "종료 시각은 시작 시각보다 늦어야 합니다.",
    path: ["endAt"],
  });

