"use client";

import { useState } from "react";

export function PracticeInputs() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [result, setResult] = useState("");

  function handleCalculate() {
    setResult(String(Number(firstNumber) + Number(secondNumber)));
  }

  return (
    <section className="flex flex-col items-start gap-4 bg-white p-8 text-slate-950">
      <h2 className="text-xl font-semibold">Practice inputs</h2>

      <label htmlFor="practice-first-number">First number</label>
      <input
        id="practice-first-number"
        data-testid="practice-first-number"
        type="number"
        value={firstNumber}
        onChange={(event) => setFirstNumber(event.target.value)}
      />

      <label htmlFor="practice-second-number">Second number</label>
      <input
        id="practice-second-number"
        data-testid="practice-second-number"
        type="number"
        value={secondNumber}
        onChange={(event) => setSecondNumber(event.target.value)}
      />

      <button data-testid="practice-calculate-button" onClick={handleCalculate}>
        Calculate practice
      </button>

      <output
        data-testid="practice-result"
        htmlFor="practice-first-number practice-second-number"
      >
        Result: {result}
      </output>
    </section>
  );
}
