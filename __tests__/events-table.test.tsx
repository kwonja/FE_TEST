import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EventsTable } from "@/features/schedule/components/events-table";
import type { CalendarEvent } from "@/features/schedule/model/events";

const events: CalendarEvent[] = [
  {
    id: 1,
    title: "서울 기획 회의",
    description: "분기 목표 검토",
    startAt: "2026-06-15T09:00:00+09:00",
    endAt: "2026-06-15T10:00:00+09:00",
    status: "planned",
    category: "meeting",
    location: "서울 회의실",
    isAllDay: false,
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "부산 고객 미팅",
    description: "신규 기능 소개",
    startAt: "2026-06-18T14:00:00+09:00",
    endAt: "2026-06-18T15:00:00+09:00",
    status: "completed",
    category: "work",
    location: "부산 오피스",
    isAllDay: false,
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
  },
];

describe("EventsTable", () => {
  it("검색어와 일치하는 일정만 표시한다", async () => {
    const user = userEvent.setup();

    render(
      <EventsTable events={events} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getAllByTestId("event-table-row")).toHaveLength(2);

    await user.type(screen.getByTestId("event-search-input"), "부산");

    expect(screen.getByText("부산 고객 미팅")).toBeInTheDocument();
    expect(screen.queryByText("서울 기획 회의")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("event-table-row")).toHaveLength(1);
  });

  it("수정 버튼을 누르면 해당 일정을 전달한다", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(
      <EventsTable
        events={events}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "서울 기획 회의 수정" }),
    );

    expect(handleEdit).toHaveBeenCalledWith(events[0]);
  });
});

