import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GameHub } from "@/features/game-hub/components/game-hub";

describe("GameHub", () => {
  it("활성 게임과 준비 중인 게임 바로가기를 구분한다", () => {
    render(<GameHub />);

    expect(screen.getByTestId("solar-system-background")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      screen.getByRole("heading", { name: /고민은 짧게/ }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /사다리.*OPEN/ }),
    ).toHaveAttribute("href", "/games/ladder");
    expect(
      screen.getByRole("link", { name: /랜덤 뽑기.*OPEN/ }),
    ).toHaveAttribute("href", "/games/random-draw");
    expect(
      screen.getByRole("link", { name: /반응속도.*OPEN/ }),
    ).toHaveAttribute("href", "/games/reaction-speed");
    expect(
      screen.getByRole("link", { name: /3.33 맞추기.*OPEN/ }),
    ).toHaveAttribute("href", "/games/seven-seven-timer");
    expect(
      screen.getByRole("link", { name: /초성게임.*OPEN/ }),
    ).toHaveAttribute("href", "/games/initial-consonant");
    expect(
      screen.getByRole("button", { name: /룰렛.*SOON/ }),
    ).toBeDisabled();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByText("GAME 002")).toBeInTheDocument();
    expect(screen.getByText("GAME 003")).toBeInTheDocument();
    expect(screen.getByText("GAME 005")).toBeInTheDocument();
    expect(screen.getByText("05")).toBeInTheDocument();
  });
});
