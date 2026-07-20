import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createEvent,
  deleteEvent,
  getEvents,
  isEventRequestCanceled,
  updateEvent,
} from "@/features/schedule/client/events-api";
import { OfflineError } from "@/shared/api/http-error";

const { assertOnlineMock, httpClientMock } = vi.hoisted(() => ({
  assertOnlineMock: vi.fn(),
  httpClientMock: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("@/shared/api/http-client", () => ({
  httpClient: httpClientMock,
}));

vi.mock("@/shared/api/network", () => ({
  assertOnline: assertOnlineMock,
}));

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

describe("events API", () => {
  beforeEach(() => {
    assertOnlineMock.mockReset();
    Object.values(httpClientMock).forEach((mock) => mock.mockReset());
  });

  it("온라인 여부를 확인하고 AbortSignal과 함께 일정을 조회한다", async () => {
    const controller = new AbortController();
    httpClientMock.get.mockResolvedValue({ data: [calendarEvent] });

    await expect(getEvents(controller.signal)).resolves.toEqual([
      calendarEvent,
    ]);

    expect(assertOnlineMock).toHaveBeenCalledWith(
      "오프라인에서는 일정을 불러올 수 없습니다.",
    );
    expect(httpClientMock.get).toHaveBeenCalledWith("/events", {
      signal: controller.signal,
    });
  });

  it("온라인 여부를 확인하고 일정을 생성한다", async () => {
    httpClientMock.post.mockResolvedValue({ data: calendarEvent });

    await expect(createEvent(eventInput)).resolves.toEqual(calendarEvent);

    expect(assertOnlineMock).toHaveBeenCalledWith(
      "오프라인에서는 일정을 저장할 수 없습니다.",
    );
    expect(httpClientMock.post).toHaveBeenCalledWith("/events", eventInput);
  });

  it("온라인 여부를 확인하고 일정을 수정한다", async () => {
    httpClientMock.patch.mockResolvedValue({ data: calendarEvent });

    await expect(updateEvent(1, eventInput)).resolves.toEqual(calendarEvent);

    expect(assertOnlineMock).toHaveBeenCalledWith(
      "오프라인에서는 일정을 저장할 수 없습니다.",
    );
    expect(httpClientMock.patch).toHaveBeenCalledWith(
      "/events/1",
      eventInput,
    );
  });

  it("온라인 여부를 확인하고 일정을 삭제한다", async () => {
    httpClientMock.delete.mockResolvedValue({ data: undefined });

    await expect(deleteEvent(1)).resolves.toBeUndefined();

    expect(assertOnlineMock).toHaveBeenCalledWith(
      "오프라인에서는 일정을 삭제할 수 없습니다.",
    );
    expect(httpClientMock.delete).toHaveBeenCalledWith("/events/1");
  });

  it("오프라인 오류 타입과 작업별 메시지를 유지한다", async () => {
    assertOnlineMock.mockImplementation((message?: string) => {
      throw new OfflineError(message);
    });

    await expect(getEvents()).rejects.toMatchObject({
      message: "오프라인에서는 일정을 불러올 수 없습니다.",
      name: "OfflineError",
    });
    expect(httpClientMock.get).not.toHaveBeenCalled();
  });

  it("Axios 응답의 message를 기능 오류로 정규화한다", async () => {
    httpClientMock.post.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { message: "일정 제목을 확인해 주세요." },
      },
    });

    await expect(createEvent(eventInput)).rejects.toThrow(
      "일정 제목을 확인해 주세요.",
    );
  });

  it("응답 message가 없으면 작업별 기본 오류로 정규화한다", async () => {
    httpClientMock.delete.mockRejectedValue(new Error("Network Error"));

    await expect(deleteEvent(1)).rejects.toThrow(
      "일정을 삭제하지 못했습니다.",
    );
  });

  it("Axios 취소 오류를 그대로 유지하고 판별한다", async () => {
    const canceledError = new axios.CanceledError();
    httpClientMock.get.mockRejectedValue(canceledError);

    await expect(getEvents()).rejects.toBe(canceledError);
    expect(isEventRequestCanceled(canceledError)).toBe(true);
    expect(isEventRequestCanceled(new Error("실패"))).toBe(false);
  });
});
