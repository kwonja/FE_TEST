import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PracticeInputs } from "@/app/practice-inputs";

describe("PracticeInputs", () => {
  it("adds first number and second number", async () => {
    const user = userEvent.setup();

    render(<PracticeInputs />);

    await user.type(screen.getByTestId("practice-first-number"), "10");
    await user.type(screen.getByTestId("practice-second-number"), "5");
    await user.click(screen.getByTestId("practice-calculate-button"));

    expect(screen.getByTestId("practice-result")).toHaveTextContent(
      "Result: 15",
    );
  });
});
