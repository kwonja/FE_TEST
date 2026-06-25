"use client";

import { useState } from "react";
import { calculate, formatResult, type Operator } from "@/lib/calculator";

const operators: Array<{ label: string; value: Operator }> = [
  { label: "+", value: "add" },
  { label: "-", value: "subtract" },
  { label: "x", value: "multiply" },
  { label: "/", value: "divide" },
];

export function Calculator() {
  const [left, setLeft] = useState("8");
  const [right, setRight] = useState("2");
  const [operator, setOperator] = useState<Operator>("add");
  const [result, setResult] = useState("10");
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");

    try {
      const nextResult = calculate(Number(left), operator, Number(right));
      setResult(formatResult(nextResult));
    } catch (caughtError) {
      setResult("-");
      setError(
        caughtError instanceof Error ? caughtError.message : "Calculation failed",
      );
    }
  }

  return (
    <section
      aria-labelledby="calculator-title"
      className="flex min-h-screen items-center justify-center bg-stone-100 px-6 py-12 text-slate-950"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase text-teal-700">
            Vitest sample
          </p>
          <h1 id="calculator-title" className="mt-2 text-3xl font-semibold">
            Calculator
          </h1>
        </div>

        <output
          aria-label="Calculation result"
          data-testid="calculator-result"
          className="mb-5 block rounded-md bg-slate-950 px-4 py-5 text-right text-4xl font-semibold text-white"
        >
          {result}
        </output>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            First number
            <input
              className="h-11 rounded-md border border-slate-300 px-3 text-base"
              data-testid="calculator-first-number"
              inputMode="decimal"
              type="number"
              value={left}
              onChange={(event) => setLeft(event.target.value)}
            />
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Operator</legend>
            <div className="grid grid-cols-4 gap-2">
              {operators.map((item) => (
                <button
                  aria-pressed={operator === item.value}
                  className="h-11 rounded-md border border-slate-300 text-lg font-semibold transition-colors hover:bg-slate-100 aria-pressed:border-teal-700 aria-pressed:bg-teal-700 aria-pressed:text-white"
                  data-testid={`calculator-operator-${item.value}`}
                  key={item.value}
                  onClick={() => setOperator(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-2 text-sm font-medium">
            Second number
            <input
              className="h-11 rounded-md border border-slate-300 px-3 text-base"
              data-testid="calculator-second-number"
              inputMode="decimal"
              type="number"
              value={right}
              onChange={(event) => setRight(event.target.value)}
            />
          </label>

          <button
            className="h-12 rounded-md bg-slate-950 px-4 text-base font-semibold text-white transition-colors hover:bg-teal-800"
            data-testid="calculator-submit"
            onClick={handleCalculate}
            type="button"
          >
            Calculate
          </button>

          {error ? (
            <p role="alert" className="text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
