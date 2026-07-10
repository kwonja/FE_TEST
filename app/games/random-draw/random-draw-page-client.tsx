"use client";

import { GameFeedbackModal } from "@/features/game-analytics/client/game-feedback-modal";
import { useGameFeedbackPrompt } from "@/features/game-analytics/client/use-game-feedback-prompt";
import { RandomDrawGame } from "@/features/random-draw/components/random-draw-game";

export const RandomDrawPageClient = () => {
  const feedbackPrompt = useGameFeedbackPrompt({
    gameId: "random-draw",
    gameName: "랜덤 뽑기",
  });

  return (
    <>
      <RandomDrawGame onDrawComplete={feedbackPrompt.registerPlay} />
      <GameFeedbackModal
        gameName="랜덤 뽑기"
        isOpen={feedbackPrompt.isOpen}
        isSubmitting={feedbackPrompt.isSubmitting}
        onDismiss={feedbackPrompt.dismissPrompt}
        onSubmit={feedbackPrompt.submitRating}
      />
    </>
  );
};
