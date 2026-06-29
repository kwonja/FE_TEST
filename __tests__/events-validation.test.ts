import { describe, expect, it } from "vitest";

import { eventInputSchema } from "@/lib/events-validation";

const validEvent = {
  title: "주간 회의",
  description: "",
  startAt: "2026-06-29T09:00:00.000Z",
  endAt: "2026-06-29T10:00:00.000Z",
  status: "planned",
  category: "meeting",
  location: "",
  isAllDay: false,
};

describe("eventInputSchema", () => {
  it("올바른 일정 입력을 허용한다", () => {
    expect(eventInputSchema.safeParse(validEvent).success).toBe(true);
  });

  it("시작 시각보다 빠른 종료 시각을 거부한다", () => {
    const result = eventInputSchema.safeParse({
      ...validEvent,
      endAt: "2026-06-29T08:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});

