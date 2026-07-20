import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LadderGame } from "@/features/ladder-game/components/ladder-game";

const createCanvasContextMock = () => {
  return {
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    restore: vi.fn(),
    roundRect: vi.fn(),
    save: vi.fn(),
    setLineDash: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
  };
};

const startLadderGame = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "사다리 게임 시작!" }));
  await screen.findByRole("button", { name: "성민 경로 확인" });
};

describe("LadderGame", () => {
  let notificationPermission: NotificationPermission;
  let notificationConstructor: ReturnType<typeof vi.fn>;
  let requestPermission: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      createCanvasContextMock() as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      return window.setTimeout(() => callback(performance.now() + 10_000), 0);
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      window.clearTimeout(id);
    });
    notificationPermission = "default";
    notificationConstructor = vi.fn();
    requestPermission = vi.fn().mockResolvedValue("granted");
    const notificationMock = notificationConstructor as unknown as typeof Notification;

    Object.defineProperties(notificationMock, {
      permission: {
        get: () => notificationPermission,
      },
      requestPermission: {
        value: requestPermission,
      },
    });
    vi.stubGlobal("Notification", notificationMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("시작 패널에서 알림 권한을 요청하고 게임 화면으로 진입한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    expect(screen.getByTestId("ladder-start-panel")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "오늘의 운명을 사다리로 정해볼까요?" }),
    ).toBeVisible();
    expect(
      screen.getByText("브라우저 알림은 선택 사항이에요. 허용하면 게임 결과를 알려드려요."),
    ).toBeVisible();
    expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
      "참가자와 결과를 확인한 뒤 게임을 시작하세요.",
    );
    expect(
      screen.queryByRole("button", { name: "다시 섞기" }),
    ).not.toBeInTheDocument();

    await startLadderGame(user);

    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("ladder-start-panel")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 섞기" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "성민 경로 확인" })).toHaveFocus(),
    );
  });

  it("빈 결과가 있으면 오류를 표시하고 시작 패널에 머문다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    const emptyResultInput = screen.getAllByTestId("ladder-result-input")[0];
    await user.clear(emptyResultInput);
    await user.click(
      screen.getByRole("button", { name: "사다리 게임 시작!" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "참가자와 결과를 모두 입력해 주세요.",
    );
    expect(screen.getByTestId("ladder-start-panel")).toBeVisible();
    expect(emptyResultInput).toHaveFocus();
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("중복 참가자가 있으면 오류를 표시하고 시작 패널에 머문다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    const duplicateParticipantInput = screen.getAllByTestId(
      "ladder-participant-input",
    )[1];
    await user.clear(duplicateParticipantInput);
    await user.type(duplicateParticipantInput, "성민");
    await user.click(
      screen.getByRole("button", { name: "사다리 게임 시작!" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "참가자 이름은 서로 다르게 입력해 주세요.",
    );
    expect(screen.getByTestId("ladder-start-panel")).toBeVisible();
    expect(duplicateParticipantInput).toHaveFocus();
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it("새 사다리를 만들 때 알림 권한을 다시 요청하지 않는다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    await startLadderGame(user);
    await user.click(screen.getByRole("button", { name: "새 사다리 만들기" }));

    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  it("참가자 수에 맞춰 시작 화면의 사다리 발판을 다시 배치한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    await user.click(screen.getByRole("button", { name: "참가자 추가" }));

    screen.getAllByTestId("ladder-preview-rung").forEach((rung) => {
      expect(rung).toHaveStyle({ width: "21.5%" });
      expect(["7%", "28.5%", "50%", "71.5%"]).toContain(rung.style.left);
    });
  });

  it("참가자를 추가하고 새 사다리를 생성한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    await startLadderGame(user);
    await user.click(screen.getByRole("button", { name: "참가자 추가" }));

    expect(screen.getAllByTestId("ladder-participant-input")).toHaveLength(5);
    expect(screen.getAllByTestId("ladder-result-input")).toHaveLength(5);
    expect(
      screen.getByRole("button", { name: "참가자 5 경로 확인" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
      "5명 사다리가 바로 반영됐습니다.",
    );

    const fifthParticipantInput = screen.getAllByTestId(
      "ladder-participant-input",
    )[4];
    await user.clear(fifthParticipantInput);
    await user.type(fifthParticipantInput, "하늘");

    expect(
      screen.getByRole("button", { name: "하늘 경로 확인" }),
    ).toBeInTheDocument();
  });

  it("전체 경로를 캔버스로 그리고 도착 결과를 표시한다", async () => {
    notificationPermission = "granted";
    const user = userEvent.setup();

    render(<LadderGame />);

    await startLadderGame(user);
    await user.click(screen.getByRole("button", { name: "성민 경로 확인" }));

    const ladderCanvas = screen.getByTestId("ladder-canvas");

    expect(ladderCanvas).toBeVisible();
    expect(ladderCanvas).toHaveAttribute("width", expect.stringMatching(/\d+/));
    expect(ladderCanvas).toHaveAttribute(
      "height",
      expect.stringMatching(/\d+/),
    );

    expect(screen.getByRole("img", { name: "성민의 경로" })).toBeVisible();
    await waitFor(
      () =>
        expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
          /^성민이\(가\) 도착한 결과는 '.+'입니다\.$/,
        ),
      { timeout: 5000 },
    );
    expect(notificationConstructor).toHaveBeenCalledWith(
      "사다리 게임 결과",
      {
        body: expect.stringMatching(/^성민이\(가\) 도착한 결과는 '.+'입니다\.$/),
      },
    );
  });

  it("알림을 지원하지 않아도 도착 결과를 표시한다", async () => {
    vi.stubGlobal("Notification", undefined);
    const user = userEvent.setup();

    render(<LadderGame />);

    await startLadderGame(user);
    await user.click(screen.getByRole("button", { name: "성민 경로 확인" }));

    await waitFor(
      () =>
        expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
          /^성민이\(가\) 도착한 결과는 '.+'입니다\.$/,
        ),
      { timeout: 5000 },
    );
  });

  it("알림 권한이 거부되어도 도착 결과를 표시한다", async () => {
    notificationPermission = "denied";
    const user = userEvent.setup();

    render(<LadderGame />);

    await startLadderGame(user);
    await user.click(screen.getByRole("button", { name: "성민 경로 확인" }));

    await waitFor(
      () =>
        expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
          /^성민이\(가\) 도착한 결과는 '.+'입니다\.$/,
        ),
      { timeout: 5000 },
    );
    expect(notificationConstructor).not.toHaveBeenCalled();
  });
});
