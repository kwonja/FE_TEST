import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TodoList } from "@/features/todo/components/todo-list";

describe("TodoList", () => {
  it("adds a new todo item", async () => {
    const user = userEvent.setup();

    render(<TodoList />);

    await user.type(screen.getByTestId("todo-input"), "Review test logs");
    await user.click(screen.getByTestId("todo-add-button"));

    expect(screen.getByText("Review test logs")).toBeInTheDocument();
    expect(screen.getAllByTestId("todo-item")).toHaveLength(3);
    expect(screen.getByTestId("todo-input")).toHaveValue("");
  });
});
