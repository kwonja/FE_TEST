import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameClickTrackingArea } from "@/features/game-analytics/client/game-click-tracking-area";

const originalSendBeaconDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "sendBeacon",
);
const sendBeaconMock = vi.fn(() => true);

const restoreSendBeacon = () => {
  if (originalSendBeaconDescriptor) {
    Object.defineProperty(
      window.navigator,
      "sendBeacon",
      originalSendBeaconDescriptor,
    );
    return;
  }

  Reflect.deleteProperty(window.navigator, "sendBeacon");
};

describe("GameClickTrackingArea", () => {
  beforeEach(() => {
    window.history.pushState(null, "", "/");
    Object.defineProperty(window.navigator, "sendBeacon", {
      configurable: true,
      value: sendBeaconMock,
    });
  });

  afterEach(() => {
    sendBeaconMock.mockReset();
    restoreSendBeacon();
  });

  it("게임 요소 안쪽을 클릭하면 sendBeacon으로 클릭 이벤트를 전송한다", async () => {
    const user = userEvent.setup();

    render(
      <GameClickTrackingArea>
        <button
          type="button"
          data-game-id="ladder"
          data-game-name="사다리"
        >
          <span>사다리 타기</span>
        </button>
      </GameClickTrackingArea>,
    );

    await user.click(screen.getByText("사다리 타기"));

    expect(sendBeaconMock).toHaveBeenCalledTimes(1);
    expect(sendBeaconMock).toHaveBeenCalledWith(
      "/api/analytics/game-click",
      expect.any(Blob),
    );

    const [, body] = sendBeaconMock.mock.calls[0];
    const payload = JSON.parse(await (body as Blob).text());

    expect(payload).toMatchObject({
      gameId: "ladder",
      gameName: "사다리",
      sourcePath: "/",
    });
    expect(payload.clickedAt).toEqual(expect.any(String));
  });

  it("게임 데이터가 없는 요소를 클릭하면 이벤트를 전송하지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <GameClickTrackingArea>
        <button type="button">일반 버튼</button>
      </GameClickTrackingArea>,
    );

    await user.click(screen.getByRole("button", { name: "일반 버튼" }));

    expect(sendBeaconMock).not.toHaveBeenCalled();
  });

  it("추적 영역 바깥의 게임 데이터는 전송하지 않는다", async () => {
    const user = userEvent.setup();

    render(
      <div data-game-id="outer-game" data-game-name="바깥 게임">
        <GameClickTrackingArea>
          <button type="button">안쪽 일반 버튼</button>
        </GameClickTrackingArea>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "안쪽 일반 버튼" }));

    expect(sendBeaconMock).not.toHaveBeenCalled();
  });

  it("전달받은 onClick도 함께 실행한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <GameClickTrackingArea onClick={onClick}>
        <button
          type="button"
          data-game-id="ladder"
          data-game-name="사다리"
        >
          사다리 타기
        </button>
      </GameClickTrackingArea>,
    );

    await user.click(screen.getByRole("button", { name: "사다리 타기" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(sendBeaconMock).toHaveBeenCalledTimes(1);
  });
});
