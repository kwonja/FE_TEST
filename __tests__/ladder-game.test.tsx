import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LadderGame } from "@/features/ladder-game/components/ladder-game";

describe("LadderGame", () => {
  it("참가자를 추가하고 새 사다리를 생성한다", async () => {
    const user = userEvent.setup();

    render(<LadderGame />);

    await screen.findByRole("button", { name: "민준 경로 확인" });
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

  it("전체 경로를 선과 라벨에 같은 시간으로 적용한다", async () => {
    render(<LadderGame />);

    fireEvent.click(
      await screen.findByRole("button", { name: "민준 경로 확인" }),
    );

    expect(screen.getByTestId("ladder-result-message")).toHaveTextContent(
      "민준이(가) 이동 중입니다.",
    );
    expect(screen.getByTestId("ladder-token")).toBeVisible();

    const route = screen.getByTestId("ladder-route");
    const tokenMotion = screen.getByTestId("ladder-token-motion");

    expect(route).toHaveAttribute(
      "d",
      expect.stringMatching(/^M \d+ \d+(?: L \d+ \d+)+$/),
    );
    expect(route.style.animationDuration).toBe(tokenMotion.getAttribute("dur"));
    expect(screen.getByRole("img", { name: "민준의 경로" })).toBeVisible();
  });
});
