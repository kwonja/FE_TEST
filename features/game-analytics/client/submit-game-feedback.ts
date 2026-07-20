"use client";

import { httpClient } from "@/shared/api/http-client";
import { isOnline } from "@/shared/api/network";

import type { GameFeedbackInput } from "../model/game-feedback";

export const submitGameFeedback = async (feedback: GameFeedbackInput) => {
  if (!isOnline()) {
    return;
  }

  try {
    await httpClient.post("/analytics/game-feedback", feedback);
  } catch {
    throw new Error("게임 평가 저장에 실패했습니다.");
  }
};
