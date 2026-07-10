"use client";

import { useCallback, useState } from "react";

import type { GameFeedbackRating } from "../model/game-feedback";
import {
  recordGameFeedbackDismissed,
  recordGameFeedbackRated,
  recordGamePlayed,
} from "./game-feedback-state";
import { submitGameFeedback } from "./submit-game-feedback";

interface UseGameFeedbackPromptOptions {
  gameId: string;
  gameName: string;
}

export const useGameFeedbackPrompt = ({
  gameId,
  gameName,
}: UseGameFeedbackPromptOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerPlay = useCallback(() => {
    if (recordGamePlayed(gameId)) {
      setIsOpen(true);
    }
  }, [gameId]);

  const dismissPrompt = useCallback(() => {
    recordGameFeedbackDismissed(gameId);
    setIsOpen(false);
  }, [gameId]);

  const submitRating = useCallback(
    async (rating: GameFeedbackRating) => {
      setIsSubmitting(true);

      try {
        await submitGameFeedback({
          gameId,
          gameName,
          rating,
          sourcePath: window.location.pathname,
        });
        recordGameFeedbackRated(gameId);
        setIsOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [gameId, gameName],
  );

  return {
    dismissPrompt,
    isOpen,
    isSubmitting,
    registerPlay,
    submitRating,
  };
};
