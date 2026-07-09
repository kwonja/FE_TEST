import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ReactionSpeedGame } from "@/features/reaction-speed/components/reaction-speed-game";
import {
  REACTION_MAX_HISTORY,
  REACTION_MIN_WAIT_MS,
} from "@/features/reaction-speed/model/reaction-speed";

describe("ReactionSpeedGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("대기 중에 먼저 누르면 너무 빠름 상태로 처리한다", () => {
    render(<ReactionSpeedGame />);

    fireEvent.click(screen.getByTestId("reaction-speed-start-button"));
    expect(screen.getByTestId("reaction-speed-phase")).toHaveTextContent(
      "WAITING",
    );

    fireEvent.pointerDown(screen.getByTestId("reaction-speed-pad"));

    expect(screen.getByTestId("reaction-speed-phase")).toHaveTextContent(
      "TOO_EARLY",
    );
    expect(screen.getByTestId("reaction-speed-status")).toHaveTextContent(
      "너무 빨랐어요.",
    );
    expect(screen.getByTestId("reaction-speed-current-result")).toHaveTextContent(
      "--",
    );
  });

  it("신호 이후 pointerdown 시 performance.now 차이를 ms로 기록한다", () => {
    render(<ReactionSpeedGame />);

    fireEvent.click(screen.getByTestId("reaction-speed-start-button"));

    act(() => vi.advanceTimersByTime(REACTION_MIN_WAIT_MS));
    expect(screen.getByTestId("reaction-speed-phase")).toHaveTextContent(
      "SIGNAL",
    );

    act(() => vi.advanceTimersByTime(247));
    fireEvent.pointerDown(screen.getByTestId("reaction-speed-pad"));

    expect(screen.getByTestId("reaction-speed-phase")).toHaveTextContent(
      "RESULT",
    );
    expect(screen.getByTestId("reaction-speed-current-result")).toHaveTextContent(
      "247ms",
    );
    expect(screen.getByTestId("reaction-speed-status")).toHaveTextContent(
      "반응속도는 247ms입니다.",
    );
    expect(screen.getByTestId("reaction-speed-history").children).toHaveLength(
      1,
    );
  });

  it("키보드 Enter 반응도 같은 방식으로 기록한다", () => {
    render(<ReactionSpeedGame />);

    fireEvent.click(screen.getByTestId("reaction-speed-start-button"));
    act(() => vi.advanceTimersByTime(REACTION_MIN_WAIT_MS));
    act(() => vi.advanceTimersByTime(320));
    fireEvent.keyDown(screen.getByTestId("reaction-speed-pad"), {
      key: "Enter",
    });

    expect(screen.getByTestId("reaction-speed-current-result")).toHaveTextContent(
      "320ms",
    );
  });

  it("최근 기록은 최대 다섯 개를 최신순으로 유지한다", () => {
    render(<ReactionSpeedGame />);

    for (let index = 0; index < REACTION_MAX_HISTORY + 1; index += 1) {
      fireEvent.click(screen.getByTestId("reaction-speed-start-button"));
      act(() => vi.advanceTimersByTime(REACTION_MIN_WAIT_MS));
      act(() => vi.advanceTimersByTime(200 + index));
      fireEvent.pointerDown(screen.getByTestId("reaction-speed-pad"));
    }

    const history = screen.getByTestId("reaction-speed-history");
    const records = within(history)
      .getAllByRole("listitem")
      .map((item) => item.querySelector("strong")?.textContent);

    expect(records).toEqual(["205ms", "204ms", "203ms", "202ms", "201ms"]);
    expect(records).not.toContain("200ms");
  });
});
