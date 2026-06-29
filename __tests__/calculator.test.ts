import { describe, expect, it } from "vitest";
import {
  add,
  calculate,
  formatResult,
} from "@/features/calculator/model/calculator";

describe("calculate", () => {
  it("adds two numbers", () => {
    expect(calculate(8, "add", 2)).toBe(10);
  });

  it("subtracts two numbers", () => {
    expect(calculate(8, "subtract", 2)).toBe(6);
  });

  it("multiplies two numbers", () => {
    expect(calculate(8, "multiply", 2)).toBe(16);
  });

  it("divides two numbers", () => {
    expect(calculate(8, "divide", 2)).toBe(4);
  });

  it("rejects division by zero", () => {
    expect(() => calculate(8, "divide", 0)).toThrow("Cannot divide by zero");
  });
});

describe("formatResult", () => {
  it("keeps integers compact", () => {
    expect(formatResult(10)).toBe("10");
  });

  it("rounds decimals to two places", () => {
    expect(formatResult(10 / 3)).toBe("3.33");
  });
});


describe("add", () => {
  it("adds two numbers", () => {
    expect(add(8, 2)).toBe(10);
  });

  it("adds two numbers", () => {
    expect(add(8, 3)).toBe(11);
  });
});
