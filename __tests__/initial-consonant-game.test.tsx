import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InitialConsonantGame } from "@/features/initial-consonant-game/components/initial-consonant-game";

describe("InitialConsonantGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const startGame = () => {
    fireEvent.click(screen.getByRole("button", { name: "게임 시작" }));
  };

  it("READY 상태에서 초성을 가리고 시작 전에는 입력을 비활성화한다", () => {
    render(<InitialConsonantGame />);

    expect(screen.getByTestId("initial-consonant-phase")).toHaveTextContent(
      "READY",
    );
    expect(screen.getByTestId("initial-consonant-question")).toHaveTextContent(
      "??",
    );
    expect(screen.queryByText("ㄱㅅ")).not.toBeInTheDocument();
    expect(screen.getByLabelText("정답 입력")).toBeDisabled();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("게임을 시작하면 입력창에 초점을 두고 5초 타이머를 시작한다", () => {
    render(<InitialConsonantGame />);
    startGame();

    expect(screen.getByTestId("initial-consonant-phase")).toHaveTextContent(
      "PLAYING",
    );
    expect(screen.getByTestId("initial-consonant-question")).toHaveTextContent(
      "ㄱㅅ",
    );
    expect(screen.getByLabelText("정답 입력")).toHaveFocus();
    expect(screen.getByLabelText("정답 입력")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "5",
    );
  });

  it("정답이면 점수를 올리고 다른 문제와 0초 progress로 초기화한다", () => {
    render(<InitialConsonantGame />);
    startGame();
    act(() => vi.advanceTimersByTime(1_000));

    fireEvent.change(screen.getByLabelText("정답 입력"), {
      target: { value: "가슴" },
    });
    fireEvent.click(screen.getByRole("button", { name: "제출" }));

    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("1");
    expect(screen.getByTestId("initial-consonant-question")).toHaveTextContent(
      "ㄱㅂ",
    );
    expect(screen.getByLabelText("정답 입력")).toHaveValue("");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("오답이면 점수, 문제, 타이머를 유지하고 오류 상태를 알린다", () => {
    render(<InitialConsonantGame />);
    startGame();
    act(() => vi.advanceTimersByTime(1_000));

    fireEvent.change(screen.getByLabelText("정답 입력"), {
      target: { value: "나무" },
    });
    fireEvent.click(screen.getByRole("button", { name: "제출" }));

    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("0");
    expect(screen.getByTestId("initial-consonant-question")).toHaveTextContent(
      "ㄱㅅ",
    );
    expect(screen.getByLabelText("정답 입력")).toHaveValue("나무");
    expect(screen.getByLabelText("정답 입력")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      Number(screen.getByRole("progressbar").getAttribute("aria-valuenow")),
    ).toBeGreaterThanOrEqual(1);
  });

  it("정확히 5초에 게임 오버 창과 최종 점수를 표시한다", () => {
    render(<InitialConsonantGame />);
    startGame();

    act(() => vi.advanceTimersByTime(4_950));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "게임 오버!" })).toBeInTheDocument();
    expect(screen.getByText(/최종 점수는/)).toHaveTextContent("0점");
    expect(
      screen.getByTestId("initial-consonant-progress-fill").parentElement,
    ).toHaveAttribute("aria-valuenow", "5");
  });

  it("다시하기로 점수와 타이머를 초기화하고 입력창에 초점을 돌린다", () => {
    render(<InitialConsonantGame />);
    startGame();
    act(() => vi.advanceTimersByTime(5_000));

    fireEvent.click(screen.getByRole("button", { name: "다시하기" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("0");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByLabelText("정답 입력")).toHaveFocus();
  });

  it("IME 조합 중 Enter 제출은 무시한다", () => {
    render(<InitialConsonantGame />);
    startGame();
    const input = screen.getByLabelText("정답 입력");
    const form = input.closest("form");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "가수" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.submit(form!);

    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("0");
    expect(screen.getByTestId("initial-consonant-question")).toHaveTextContent(
      "ㄱㅅ",
    );
  });

  it("compositionEnd 직후 keyCode 229 Enter도 제출을 막는다", () => {
    render(<InitialConsonantGame />);
    startGame();
    const input = screen.getByLabelText("정답 입력");

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "가슴" } });
    fireEvent.compositionEnd(input);

    expect(
      fireEvent.keyDown(input, {
        key: "Enter",
        code: "Enter",
        keyCode: 229,
        which: 229,
      }),
    ).toBe(false);
    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("0");
    expect(screen.getByLabelText("정답 입력")).toHaveValue("가슴");
  });

  it("deadline 1ms 전 제출은 정답으로 처리한다", () => {
    render(<InitialConsonantGame />);
    startGame();
    fireEvent.change(screen.getByLabelText("정답 입력"), {
      target: { value: "가슴" },
    });

    act(() => vi.advanceTimersByTime(4_999));
    fireEvent.click(screen.getByRole("button", { name: "제출" }));

    expect(screen.getByTestId("initial-consonant-score")).toHaveTextContent("1");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("timer tick 전이라도 deadline과 같은 시각의 제출은 게임 오버 처리한다", () => {
    vi.spyOn(window, "setInterval").mockReturnValue(1);
    render(<InitialConsonantGame />);
    startGame();
    fireEvent.change(screen.getByLabelText("정답 입력"), {
      target: { value: "가슴" },
    });

    act(() => vi.advanceTimersByTime(5_000));
    fireEvent.click(screen.getByRole("button", { name: "제출" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/최종 점수는/)).toHaveTextContent("0점");
  });

  it("컴포넌트가 unmount되면 진행 중인 interval을 정리한다", () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const { unmount } = render(<InitialConsonantGame />);
    startGame();

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
