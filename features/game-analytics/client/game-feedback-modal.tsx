"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import type { GameFeedbackRating } from "../model/game-feedback";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

const RATINGS: GameFeedbackRating[] = [1, 2, 3, 4, 5];
const RATING_LABELS: Record<GameFeedbackRating, string> = {
  1: "별로예요",
  2: "아쉬워요",
  3: "괜찮아요",
  4: "좋아요",
  5: "최고예요",
};

interface GameFeedbackModalProps {
  gameName: string;
  isOpen: boolean;
  isSubmitting: boolean;
  onDismiss: () => void;
  onSubmit: (rating: GameFeedbackRating) => Promise<void>;
}

export const GameFeedbackModal = ({
  gameName,
  isOpen,
  isSubmitting,
  onDismiss,
  onSubmit,
}: GameFeedbackModalProps) => {
  const [selectedRating, setSelectedRating] =
    useState<GameFeedbackRating | null>(null);

  const handleSubmit = async () => {
    if (!selectedRating) {
      return;
    }

    await onSubmit(selectedRating);
    setSelectedRating(null);
  };

  const handleDismiss = () => {
    setSelectedRating(null);
    onDismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] gap-5 rounded-md border-2 border-game-ink bg-game-paper p-5 text-game-ink shadow-[6px_6px_0_var(--game-ink)] sm:max-w-md sm:p-6"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {gameName}, 어땠나요?
          </DialogTitle>
          <DialogDescription className="text-sm font-semibold text-muted-foreground">
            별점은 1점부터 5점까지 선택할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border-2 border-game-ink bg-white p-4">
          <div
            className="flex justify-center gap-2"
            aria-label="게임 만족도 별점"
          >
            {RATINGS.map((rating) => {
              const isSelected =
                selectedRating !== null && rating <= selectedRating;

              return (
                <button
                  key={rating}
                  type="button"
                  className={`grid size-11 place-items-center rounded-md border-2 border-game-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 ${
                    isSelected
                      ? "bg-game-acid text-game-ink"
                      : "bg-game-paper text-muted-foreground"
                  }`}
                  aria-label={`${rating}점`}
                  aria-pressed={selectedRating === rating}
                  disabled={isSubmitting}
                  onClick={() => setSelectedRating(rating)}
                >
                  <Star
                    className={isSelected ? "size-6 fill-current" : "size-6"}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <p
            className="mt-4 min-h-5 text-center text-sm font-black"
            data-testid="game-feedback-rating-label"
          >
            {selectedRating ? RATING_LABELS[selectedRating] : "별점을 골라주세요"}
          </p>
        </div>

        <DialogFooter className="-mx-5 -mb-5 gap-2 rounded-none border-t-2 border-game-ink bg-white p-5 sm:-mx-6 sm:-mb-6 sm:p-6">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-game-ink"
            disabled={isSubmitting}
            onClick={handleDismiss}
          >
            나중에
          </Button>
          <Button
            type="button"
            className="border-2 border-game-ink bg-game-ink text-white hover:bg-game-ink/85"
            disabled={!selectedRating || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "저장 중..." : "평가하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
