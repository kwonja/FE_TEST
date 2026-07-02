import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LadderGame } from "@/features/ladder-game/components/ladder-game";

describe("LadderGame", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("참가자를 추가하고 새 사다리를 생성한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

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

  it("한 칸씩 이동한 뒤 연결된 결과를 공개한다", () => {
    vi.useFakeTimers();
    render(<LadderGame />);

    fireEvent.click(screen.getByRole("button", { name: "민준 경로 확인" }));

    expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
      "민준이(가) 이동 중입니다.",
    );
    expect(screen.getByTestId("ladder-token")).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
      /^민준이\(가\) 도착한 결과는 '.+'입니다\.$/,
    );
    expect(screen.getByRole("img", { name: "민준의 경로" })).toBeVisible();
  });
});
