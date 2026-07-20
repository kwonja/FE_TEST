import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { registerServiceWorker } from "@/shared/lib/service-worker";

const originalServiceWorkerDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "serviceWorker",
);

describe("registerServiceWorker", () => {
  const registerMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    registerMock.mockResolvedValue({});
    Object.defineProperty(window.navigator, "serviceWorker", {
      configurable: true,
      value: { register: registerMock },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    registerMock.mockReset();

    if (originalServiceWorkerDescriptor) {
      Object.defineProperty(
        window.navigator,
        "serviceWorker",
        originalServiceWorkerDescriptor,
      );
      return;
    }

    Reflect.deleteProperty(window.navigator, "serviceWorker");
  });

  it("루트 범위의 서비스 워커를 등록한다", async () => {
    await registerServiceWorker();

    expect(registerMock).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  });

  it("등록 오류가 발생해도 예외를 전파하지 않는다", async () => {
    registerMock.mockRejectedValue(new Error("등록 실패"));

    await expect(registerServiceWorker()).resolves.toBeUndefined();
  });
});
