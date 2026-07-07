import { useEffect, useRef } from "react";

import type { Ladder, LadderRoutePoint } from "../model/ladder";
import {
  createDrawSteps,
  drawCanvasFrame,
  getCanvasContext,
  getDrawLength,
  runRouteAnimation,
  shouldReduceMotion,
} from "../utils/ladder-canvas";
import type { BoardSize } from "../utils/ladder-board-geometry";
import {
  BOARD_VERTICAL_INSET,
  CELL_SIZE,
  type PlayerStyle,
} from "./ladder-board.constants";

type LadderRouteCanvasProps = {
  ladder: Ladder;
  participants: string[];
  selectedParticipant: number | null;
  selectedStyle: PlayerStyle | null;
  boardSize: BoardSize;
  viewportHeight: number;
  fullPath: string | null;
  routePoints: LadderRoutePoint[];
  routeDuration: number;
  onRouteComplete: () => void;
};

export const LadderRouteCanvas = ({
  ladder,
  participants,
  selectedParticipant,
  selectedStyle,
  boardSize,
  viewportHeight,
  fullPath,
  routePoints,
  routeDuration,
  onRouteComplete,
}: LadderRouteCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = getCanvasContext(canvas);

    if (!context) {
      if (selectedParticipant !== null && fullPath) {
        onRouteComplete();
      }
      return;
    }

    const drawSteps = createDrawSteps(routePoints, CELL_SIZE);
    const totalLength = getDrawLength(drawSteps);
    const label =
      selectedParticipant === null ? "" : String(selectedParticipant + 1);
    const selectedStroke = selectedStyle?.stroke ?? null;
    const drawFrame = (progress: number) =>
      drawCanvasFrame({
        context,
        ladder,
        participants,
        selectedParticipant,
        selectedStroke,
        boardSize,
        fullPath,
        drawSteps,
        totalLength,
        label,
        progress,
        cellSize: CELL_SIZE,
        verticalInset: BOARD_VERTICAL_INSET,
      });

    if (selectedParticipant === null || !fullPath) {
      drawFrame(0);
      return;
    }

    const animationDuration = shouldReduceMotion() ? 0 : routeDuration;
    const cleanupAnimation = runRouteAnimation({
      duration: animationDuration,
      drawFrame,
      onComplete: onRouteComplete,
    });

    return cleanupAnimation;
  }, [
    boardSize,
    fullPath,
    ladder,
    onRouteComplete,
    participants,
    routeDuration,
    routePoints,
    selectedParticipant,
    selectedStyle,
  ]);

  return (
    <div className="mt-8 border-y border-game-ink/20 bg-white px-3 py-6 sm:px-5 sm:py-8">
      <div
        className="relative w-full"
        data-testid="ladder-route-animation"
        style={{
          aspectRatio: `${boardSize.width} / ${viewportHeight}`,
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          width={boardSize.width}
          height={viewportHeight}
          role="img"
          aria-label={
            selectedParticipant === null
              ? "선택을 기다리는 사다리"
              : `${participants[selectedParticipant]}의 경로`
          }
          data-testid="ladder-canvas"
        />
      </div>
    </div>
  );
};
