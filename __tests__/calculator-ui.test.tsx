import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Calculator } from "@/features/calculator/components/calculator";

describe("Calculator", () => {
  it("calculates with user input", async () => {
    const user = userEvent.setup();

    render(<Calculator />);

    await user.clear(screen.getByTestId("calculator-first-number"));
    await user.type(screen.getByTestId("calculator-first-number"), "12");
    await user.click(screen.getByTestId("calculator-operator-multiply"));
    await user.clear(screen.getByTestId("calculator-second-number"));
    await user.type(screen.getByTestId("calculator-second-number"), "3");
    await user.click(screen.getByTestId("calculator-submit"));

    expect(screen.getByTestId("calculator-result")).toHaveTextContent("36");
  });

  it("shows an error when dividing by zero", async () => {
    const user = userEvent.setup();

    render(<Calculator />);

    await user.click(screen.getByTestId("calculator-operator-divide"));
    await user.clear(screen.getByTestId("calculator-second-number"));
    await user.type(screen.getByTestId("calculator-second-number"), "0");
    await user.click(screen.getByTestId("calculator-submit"));

    expect(screen.getByRole("alert")).toHaveTextContent("Cannot divide by zero");
  });
});
