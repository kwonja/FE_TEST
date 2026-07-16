"use client";

import { httpClient } from "@/shared/api/http-client";
import { isOfflineError } from "@/shared/api/http-error";

import type { GameFeedbackInput } from "../model/game-feedback";

export const submitGameFeedback = async (feedback: GameFeedbackInput) => {
  try {
    await httpClient.post("/analytics/game-feedback", feedback);
  } catch (error) {
    if (isOfflineError(error)) {
      return;
    }

    throw new Error("게임 평가 저장에 실패했습니다.");
  }
};
