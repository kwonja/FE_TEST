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

describe("LadderGame", () => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  it("참가자를 추가하고 새 사다리를 생성한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    await screen.findByRole("button", { name: "성민 경로 확인" });
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
    render(<LadderGame />);

    await userEvent.click(
      await screen.findByRole("button", { name: "성민 경로 확인" }),
    );

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
  });
});
