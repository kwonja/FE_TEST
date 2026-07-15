"use client";

import type { GameFeedbackInput } from "../model/game-feedback";

export const submitGameFeedback = async (feedback: GameFeedbackInput) => {
  if (!navigator.onLine) {
    return;
  }

  const response = await fetch("/api/analytics/game-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });

  if (!response.ok) {
    throw new Error("게임 평가 저장에 실패했습니다.");
  }
};
