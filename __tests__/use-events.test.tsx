import { act, renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEvents } from "@/features/schedule/hooks/use-events";
import { OfflineError } from "@/shared/api/http-error";

const httpClientMock = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/shared/api/http-client", () => ({
  httpClient: httpClientMock,
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

const createAxiosResponseError = (message: string) => ({
  isAxiosError: true,
  response: {
    data: { message },
  },
});

describe("useEvents", () => {
  beforeEach(() => {
    Object.values(httpClientMock).forEach((mock) => mock.mockReset());
    httpClientMock.get.mockResolvedValue({ data: [] });
  });

  it("서버 오류 응답의 message를 일정 오류로 표시한다", async () => {
    httpClientMock.get.mockRejectedValue(
      createAxiosResponseError("일정 서버를 사용할 수 없습니다."),
    );

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "일정 서버를 사용할 수 없습니다.",
      );
    });
  });

  it("오프라인 오류를 일정 기능의 사용자 문구로 표시한다", async () => {
    httpClientMock.get.mockRejectedValue(new OfflineError());

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.error).toBe(
        "오프라인에서는 일정을 불러올 수 없습니다.",
      );
    });
  });

  it("취소된 초기 조회는 오류로 표시하지 않는다", async () => {
    httpClientMock.get.mockRejectedValue(new axios.CanceledError());

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBeNull();
  });

  it("저장 API 오류의 서버 message를 호출자에게 전달한다", async () => {
    httpClientMock.post.mockRejectedValue(
      createAxiosResponseError("일정 제목을 확인해 주세요."),
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
});
