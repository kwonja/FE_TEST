import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { NetworkStatusBanner } from "@/shared/ui/network-status-banner";

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

describe("NetworkStatusBanner", () => {
  beforeEach(() => {
    setOnlineStatus(true);
  });

  afterEach(() => {
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

  it("오프라인 상태를 전역 상태 메시지로 표시한다", () => {
    setOnlineStatus(false);
    render(<NetworkStatusBanner />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "오프라인으로 플레이 중입니다.",
    );
  });

  it("온라인으로 복구되면 상태 메시지를 숨긴다", () => {
    setOnlineStatus(false);
    render(<NetworkStatusBanner />);

    act(() => {
      setOnlineStatus(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
