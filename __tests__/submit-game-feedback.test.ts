import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitGameFeedback } from "@/features/game-analytics/client/submit-game-feedback";
import { OfflineError } from "@/shared/api/http-error";

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("@/shared/api/http-client", () => ({
  httpClient: {
    post: postMock,
  },
}));

const feedback = {
  gameId: "ladder",
  gameName: "사다리 타기",
  rating: 5 as const,
  sourcePath: "/games/ladder",
};

describe("submitGameFeedback", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("게임 평가를 공통 HTTP 클라이언트로 전송한다", async () => {
    postMock.mockResolvedValue({ data: {} });

    await submitGameFeedback(feedback);

    expect(postMock).toHaveBeenCalledWith(
      "/analytics/game-feedback",
      feedback,
    );
  });

  it("오프라인 오류는 사용자 흐름을 방해하지 않고 생략한다", async () => {
    postMock.mockRejectedValue(new OfflineError());

    await expect(submitGameFeedback(feedback)).resolves.toBeUndefined();
  });

  it("HTTP 요청 실패는 기존 기능 오류 메시지로 변환한다", async () => {
    postMock.mockRejectedValue(new Error("Request failed with status 500"));

    await expect(submitGameFeedback(feedback)).rejects.toThrow(
      "게임 평가 저장에 실패했습니다.",
    );
  });
});
