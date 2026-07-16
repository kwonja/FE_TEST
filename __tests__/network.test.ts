import { afterEach, describe, expect, it } from "vitest";

import { OfflineError } from "@/shared/api/http-error";
import { assertOnline, isOnline } from "@/shared/api/network";

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "navigator",
);
const originalOnlineDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "onLine",
);

const setOnlineStatus = (online: boolean) => {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value: online,
  });
};

const restoreNavigator = () => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(
      globalThis,
      "navigator",
      originalNavigatorDescriptor,
    );
  }
};

const restoreOnlineStatus = () => {
  if (originalOnlineDescriptor) {
    Object.defineProperty(
      window.navigator,
      "onLine",
      originalOnlineDescriptor,
    );
    return;
  }

  Reflect.deleteProperty(window.navigator, "onLine");
};

describe("network", () => {
  afterEach(() => {
    restoreNavigator();
    restoreOnlineStatus();
  });

  it("서버 환경에서는 온라인으로 판단한다", () => {
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: undefined,
    });

    expect(isOnline()).toBe(true);
    expect(assertOnline).not.toThrow();
  });

  it("브라우저가 온라인이면 요청 가능 상태를 유지한다", () => {
    setOnlineStatus(true);

    expect(isOnline()).toBe(true);
    expect(assertOnline).not.toThrow();
  });

  it("브라우저가 오프라인이면 OfflineError를 던진다", () => {
    setOnlineStatus(false);

    expect(isOnline()).toBe(false);
    expect(assertOnline).toThrow(OfflineError);
  });

  it("오프라인 오류에 기능별 메시지를 지정할 수 있다", () => {
    setOnlineStatus(false);

    expect(() => assertOnline("일정을 불러올 수 없습니다.")).toThrow(
      "일정을 불러올 수 없습니다.",
    );
  });
});
