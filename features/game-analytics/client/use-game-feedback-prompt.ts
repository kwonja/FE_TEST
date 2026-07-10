"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GameFeedbackRating } from "../model/game-feedback";
import {
  recordGameFeedbackDismissed,
  recordGameFeedbackRated,
  recordGamePlayed,
} from "./game-feedback-state";
import { submitGameFeedback } from "./submit-game-feedback";

const FEEDBACK_PROMPT_DELAY_MS = 500;

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
  const promptTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (promptTimerRef.current !== null) {
        window.clearTimeout(promptTimerRef.current);
      }
    };
  }, []);

  const registerPlay = useCallback(() => {
    if (recordGamePlayed(gameId)) {
      promptTimerRef.current = window.setTimeout(() => {
        setIsOpen(true);
        promptTimerRef.current = null;
      }, FEEDBACK_PROMPT_DELAY_MS);
    }
  }, [gameId]);

  const dismissPrompt = useCallback(() => {
    if (promptTimerRef.current !== null) {
      window.clearTimeout(promptTimerRef.current);
      promptTimerRef.current = null;
    }

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
