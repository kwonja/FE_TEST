import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RandomDrawGame } from "@/features/random-draw/components/random-draw-game";
import { DRAW_DURATION_MS } from "@/features/random-draw/model/random-draw";

describe("RandomDrawGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.49);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("셔플 중에는 결과를 발표하지 않고 완료 후 결과와 이력을 표시한다", () => {
    render(<RandomDrawGame />);

    fireEvent.click(screen.getByTestId("random-draw-button"));

    expect(screen.getByTestId("random-draw-phase")).toHaveTextContent(
      "DRAWING",
    );
    expect(screen.getByTestId("random-draw-status")).toHaveTextContent("");
    expect(screen.getByTestId("random-draw-button")).toBeDisabled();

    act(() => vi.advanceTimersByTime(DRAW_DURATION_MS));

    expect(screen.getByTestId("random-draw-phase")).toHaveTextContent("RESULT");
    expect(screen.getByTestId("random-draw-number")).toHaveTextContent("50");
    expect(screen.getByTestId("random-draw-status")).toHaveTextContent(
      "뽑힌 숫자는 50입니다.",
    );
    expect(screen.getByTestId("random-draw-history").children).toHaveLength(1);
  });

  it("서로 다른 6회 결과 중 최근 다섯 개만 최신순으로 유지한다", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    vi.mocked(Math.random)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5);
    render(<RandomDrawGame />);

    for (let index = 0; index < 6; index += 1) {
      fireEvent.click(screen.getByTestId("random-draw-button"));
    }

    const history = screen.getByTestId("random-draw-history");
    const results = within(history)
      .getAllByRole("listitem")
      .map((item) => item.querySelector("strong")?.textContent);

    expect(results).toEqual(["51", "41", "31", "21", "11"]);
    expect(within(history).queryByText("1")).not.toBeInTheDocument();
  });

  it("DRAWING 중 중복 클릭은 추가 추첨을 만들지 않는다", () => {
    render(<RandomDrawGame />);

    const drawButton = screen.getByTestId("random-draw-button");
    fireEvent.click(drawButton);
    fireEvent.click(drawButton);

    expect(drawButton).toBeDisabled();
    act(() => vi.advanceTimersByTime(DRAW_DURATION_MS));

    expect(screen.getByTestId("random-draw-history").children).toHaveLength(1);
    expect(screen.getByTestId("random-draw-status")).toHaveTextContent(
      "뽑힌 숫자는 50입니다.",
    );
  });

  it("진행 중 unmount하면 타이머를 정리해 추가 상태 갱신을 막는다", () => {
    const randomSpy = vi.mocked(Math.random);
    const { unmount } = render(<RandomDrawGame />);

    fireEvent.click(screen.getByTestId("random-draw-button"));
    const callsBeforeUnmount = randomSpy.mock.calls.length;
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(DRAW_DURATION_MS * 2));
    expect(randomSpy).toHaveBeenCalledTimes(callsBeforeUnmount);
  });

  it("reduced motion 환경에서는 즉시 결과를 확정한다", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    render(<RandomDrawGame />);

    fireEvent.click(screen.getByTestId("random-draw-button"));

    expect(screen.getByTestId("random-draw-phase")).toHaveTextContent("RESULT");
    expect(screen.getByTestId("random-draw-status")).toHaveTextContent(
      "뽑힌 숫자는 50입니다.",
    );
  });
});
