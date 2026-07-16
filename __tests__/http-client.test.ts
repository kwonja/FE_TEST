import type { AxiosAdapter } from "axios";
import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { httpClient } from "@/shared/api/http-client";

const originalOnlineDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "onLine",
);
const originalAdapter = httpClient.defaults.adapter;

const setOnlineStatus = (isOnline: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: isOnline,
  });
};

describe("httpClient", () => {
  const adapterMock: AxiosAdapter = vi.fn(async (config) => ({
    config,
    data: { ok: true },
    headers: {},
    status: 200,
    statusText: "OK",
  }));

  beforeEach(() => {
    setOnlineStatus(true);
    httpClient.defaults.adapter = adapterMock;
    vi.mocked(adapterMock).mockClear();
  });

  afterEach(() => {
    httpClient.defaults.adapter = originalAdapter;

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

  it("온라인이면 설정된 API 경로로 요청을 전달한다", async () => {
    const response = await httpClient.get("/events");

    expect(response.data).toEqual({ ok: true });
    expect(adapterMock).toHaveBeenCalledOnce();
    expect(vi.mocked(adapterMock).mock.calls[0]?.[0]).toMatchObject({
      baseURL: "/api",
      timeout: 10_000,
      url: "/events",
    });
  });

  it("오프라인 정책을 적용하지 않고 요청을 어댑터에 전달한다", async () => {
    setOnlineStatus(false);

    await expect(httpClient.get("/events")).resolves.toMatchObject({
      data: { ok: true },
    });
    expect(adapterMock).toHaveBeenCalledOnce();
  });

  it("취소된 요청은 Axios 취소 오류를 그대로 유지한다", async () => {
    const controller = new AbortController();
    controller.abort();

    const request = httpClient.get("/events", {
      signal: controller.signal,
    });

    await expect(request).rejects.toSatisfy((error: unknown) =>
      axios.isCancel(error),
    );
  });
});
