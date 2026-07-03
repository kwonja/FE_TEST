import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GameHub } from "@/features/game-hub/components/game-hub";

describe("GameHub", () => {
  it("활성 게임과 준비 중인 게임 바로가기를 구분한다", () => {
    render(<GameHub />);

    expect(
      screen.getByRole("link", { name: /사다리.*OPEN/ }),
    ).toHaveAttribute("href", "/games/ladder");
    expect(
      screen.getByRole("link", { name: /랜덤 뽑기.*OPEN/ }),
    ).toHaveAttribute("href", "/games/random-draw");
    expect(
      screen.getByRole("button", { name: /룰렛.*SOON/ }),
    ).toBeDisabled();
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByText("GAME 002")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});
