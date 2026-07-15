import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "@/shared/ui/theme-toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("다크 모드를 전환하고 선택값을 저장한다", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "테마 전환" }));

    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem("hanpan-theme")).toBe("dark");

    await user.click(screen.getByRole("button", { name: "테마 전환" }));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(window.localStorage.getItem("hanpan-theme")).toBe("light");
  });
});
