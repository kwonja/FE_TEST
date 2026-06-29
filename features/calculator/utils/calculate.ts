import type { Operator } from "../model/types";

export function calculate(left: number, operator: Operator, right: number) {
  switch (operator) {
    case "add":
      return left + right;
    case "subtract":
      return left - right;
    case "multiply":
      return left * right;
    case "divide":
      if (right === 0) {
        throw new Error("Cannot divide by zero");
      }

      return left / right;
  }
}

export function formatResult(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function add(a: number, b: number) {
  return a + b;
}
