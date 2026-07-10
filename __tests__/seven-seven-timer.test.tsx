import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SevenSevenTimerGame } from "@/features/seven-seven-timer/components/seven-seven-timer-game";

describe("SevenSevenTimerGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("시작한 뒤 경과 초를 state로 화면에 갱신한다", () => {
    render(<SevenSevenTimerGame />);

    fireEvent.click(screen.getByTestId("seven-seven-start-button"));
    act(() => vi.advanceTimersByTime(1230));

    expect(screen.getByTestId("seven-seven-phase")).toHaveTextContent(
      "RUNNING",
    );
    expect(screen.getByTestId("seven-seven-display")).toHaveTextContent(
      "1.23s",
    );
  });

  it("7.77초에 멈추면 오차와 결과를 표시한다", () => {
    render(<SevenSevenTimerGame />);

    fireEvent.click(screen.getByTestId("seven-seven-start-button"));
    act(() => vi.advanceTimersByTime(7770));
    fireEvent.click(screen.getByTestId("seven-seven-stop-button"));

    expect(screen.getByTestId("seven-seven-phase")).toHaveTextContent(
      "RESULT",
    );
    expect(screen.getByTestId("seven-seven-display")).toHaveTextContent(
      "7.77s",
    );
    expect(screen.getByTestId("seven-seven-difference")).toHaveTextContent(
      "0.00s",
    );
    expect(screen.getByTestId("seven-seven-result-message")).toHaveTextContent(
      "완벽합니다",
    );
  });

  it("다시 도전하면 이전 결과를 초기화하고 새 타이머를 시작한다", () => {
    render(<SevenSevenTimerGame />);

    fireEvent.click(screen.getByTestId("seven-seven-start-button"));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByTestId("seven-seven-stop-button"));
    fireEvent.click(screen.getByTestId("seven-seven-start-button"));

    expect(screen.getByTestId("seven-seven-phase")).toHaveTextContent(
      "RUNNING",
    );
    expect(screen.getByTestId("seven-seven-display")).toHaveTextContent(
      "0.00s",
    );
    expect(screen.getByTestId("seven-seven-difference")).toHaveTextContent(
      "--",
    );
  });
});
