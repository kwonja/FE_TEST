import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitGameFeedback } from "@/features/game-analytics/client/submit-game-feedback";

const originalOnlineDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "onLine",
);

const setOnlineStatus = (isOnline: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: isOnline,
  });
};

describe("submitGameFeedback", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    setOnlineStatus(true);
    fetchMock.mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();

    if (originalOnlineDescriptor) {
      Object.defineProperty(
        window.navigator,
        "onLine",
        originalOnlineDescriptor,
      );
      return;
    }

    Reflect.deleteProperty(window.navigator, "onLine");
  });

  it("오프라인에서는 게임 평가 API를 호출하지 않는다", async () => {
    setOnlineStatus(false);

    await submitGameFeedback({
      gameId: "ladder",
      gameName: "사다리 타기",
      rating: 5,
      sourcePath: "/games/ladder",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
