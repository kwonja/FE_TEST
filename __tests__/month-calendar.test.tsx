import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MonthCalendar } from "@/components/schedule/month-calendar";
import type { CalendarEvent } from "@/lib/events";

const event: CalendarEvent = {
  id: 1,
  title: "제품 일정 회의",
  description: "이번 주 작업 범위를 정합니다.",
  startAt: "2026-06-15T09:00:00+09:00",
  endAt: "2026-06-15T10:00:00+09:00",
  status: "planned",
  category: "meeting",
  location: "회의실 A",
  isAllDay: false,
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("MonthCalendar", () => {
  it("현재 월의 일정과 월 이동 결과를 표시한다", async () => {
    const user = userEvent.setup();

    render(
      <MonthCalendar
        events={[event]}
        initialMonth={new Date(2026, 5, 1)}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "2026년 6월" }),
    ).toBeInTheDocument();
    expect(screen.getByText("제품 일정 회의")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다음 달" }));

    expect(
      screen.getByRole("heading", { name: "2026년 7월" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("제품 일정 회의")).not.toBeInTheDocument();
  });

  it("날짜의 추가 버튼을 누르면 선택한 날짜를 전달한다", async () => {
    const user = userEvent.setup();
    const handleCreate = vi.fn();

    render(
      <MonthCalendar
        events={[]}
        initialMonth={new Date(2026, 5, 1)}
        onCreateEvent={handleCreate}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "6월 15일 일정 추가" }),
    );

    expect(handleCreate).toHaveBeenCalledOnce();
    expect(handleCreate.mock.calls[0][0]).toEqual(new Date(2026, 5, 15));
  });
});

