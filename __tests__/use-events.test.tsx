import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEvents } from "@/features/schedule/hooks/use-events";

const eventsApiMock = vi.hoisted(() => ({
  createEvent: vi.fn(),
  deleteEvent: vi.fn(),
  getEvents: vi.fn(),
  isEventRequestCanceled: vi.fn(),
  updateEvent: vi.fn(),
}));

vi.mock("@/features/schedule/client/events-api", () => eventsApiMock);

const eventInput = {
  title: "팀 회의",
  description: "주간 회의",
  startAt: "2026-07-16T09:00:00.000Z",
  endAt: "2026-07-16T10:00:00.000Z",
  status: "planned" as const,
  category: "meeting" as const,
  location: "회의실",
  isAllDay: false,
};

const calendarEvent = {
  ...eventInput,
  id: 1,
  createdAt: "2026-07-16T08:00:00.000Z",
  updatedAt: "2026-07-16T08:00:00.000Z",
};

describe("useEvents", () => {
  beforeEach(() => {
    Object.values(eventsApiMock).forEach((mock) => mock.mockReset());
    eventsApiMock.getEvents.mockResolvedValue([]);
    eventsApiMock.isEventRequestCanceled.mockReturnValue(false);
  });

  it("API에서 정규화한 오류 message를 일정 오류로 표시한다", async () => {
    eventsApiMock.getEvents.mockRejectedValue(
      new Error("일정 서버를 사용할 수 없습니다."),
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "일정 서버를 사용할 수 없습니다.",
      );
    });
  });

  it("오프라인 오류를 일정 기능의 사용자 문구로 표시한다", async () => {
    eventsApiMock.getEvents.mockRejectedValue(
      new Error("오프라인에서는 일정을 불러올 수 없습니다."),
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "오프라인에서는 일정을 불러올 수 없습니다.",
      );
    });
  });

  it("취소된 초기 조회는 오류로 표시하지 않는다", async () => {
    const canceledError = new Error("canceled");
    eventsApiMock.getEvents.mockRejectedValue(canceledError);
    eventsApiMock.isEventRequestCanceled.mockImplementation(
      (error) => error === canceledError,
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeNull();
  });

  it("새로고침이 실패해도 기존 일정은 유지한다", async () => {
    eventsApiMock.getEvents
      .mockResolvedValueOnce([calendarEvent])
      .mockRejectedValueOnce(
        new Error("오프라인에서는 일정을 불러올 수 없습니다."),
      );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual([calendarEvent]);
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.events).toEqual([calendarEvent]);
    expect(result.current.error).toBe(
      "오프라인에서는 일정을 불러올 수 없습니다.",
    );
  });

  it("저장 API 오류의 서버 message를 호출자에게 전달한다", async () => {
    eventsApiMock.createEvent.mockRejectedValue(
      new Error("일정 제목을 확인해 주세요."),
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await expect(result.current.saveEvent(eventInput)).rejects.toThrow(
        "일정 제목을 확인해 주세요.",
      );
    });
  });

  it("삭제 API 오류의 서버 message를 호출자에게 전달한다", async () => {
    eventsApiMock.deleteEvent.mockRejectedValue(
      new Error("삭제할 일정을 찾을 수 없습니다."),
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await expect(result.current.deleteEvent(1)).rejects.toThrow(
        "삭제할 일정을 찾을 수 없습니다.",
      );
    });
  });
});
