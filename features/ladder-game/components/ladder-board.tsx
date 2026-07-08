"use client";

import { useCallback, useMemo, useState } from "react";

import type { Ladder } from "../model/ladder";
import { createLadderRoute, getLadderDestination } from "../utils/ladder";
import {
  createPath,
  getBoardSize,
} from "../utils/ladder-board-geometry";
import {
  BOARD_VERTICAL_INSET,
  CELL_SIZE,
  MAX_ROUTE_DURATION_MS,
  PLAYER_STYLES,
  STEP_DURATION_MS,
} from "./ladder-board.constants";
import { LadderPlayerSelector } from "./ladder-player-selector";
import { LadderResultSlots } from "./ladder-result-slots";
import { LadderRouteCanvas } from "./ladder-route-canvas";

type LadderBoardProps = {
  ladder: Ladder;
  participants: string[];
  results: string[];
  selectedParticipant: number | null;
  onSelectParticipant: (participantIndex: number) => void;
  onRouteComplete: (
    participantIndex: number,
    destinationIndex: number,
  ) => void;
};

const shortenLabel = (value: string) => {
  return value.length > 8 ? `${value.slice(0, 7)}…` : value;
};

export const LadderBoard = ({
  ladder,
  participants,
  results,
  selectedParticipant,
  onSelectParticipant,
  onRouteComplete,
}: LadderBoardProps) => {
  const [isComplete, setIsComplete] = useState(false);

  const routePoints = useMemo(
    () =>
      selectedParticipant === null
        ? []
        : createLadderRoute(ladder, selectedParticipant),
    [ladder, selectedParticipant],
  );
  const boardSize = useMemo(() => getBoardSize(ladder, CELL_SIZE), [ladder]);
  const viewportHeight = boardSize.height + BOARD_VERTICAL_INSET * 2;
  const selectedStyle =
    selectedParticipant === null
      ? null
      : PLAYER_STYLES[selectedParticipant % PLAYER_STYLES.length];
  const selectedDestination =
    selectedParticipant !== null && isComplete
      ? getLadderDestination(ladder, selectedParticipant)
      : null;
  const fullPath =
    routePoints.length > 1 ? createPath(routePoints, CELL_SIZE) : null;
  const routeDuration = Math.min(
    Math.max(routePoints.length - 1, 0) * STEP_DURATION_MS,
    MAX_ROUTE_DURATION_MS,
  );
  const mobileBoardMinWidth =
    ladder.playerCount > 6 ? ladder.playerCount * 56 : undefined;

  const completeRoute = useCallback(() => {
    if (selectedParticipant === null) {
      return;
    }

    setIsComplete(true);
    onRouteComplete(
      selectedParticipant,
      getLadderDestination(ladder, selectedParticipant),
    );
  }, [ladder, onRouteComplete, selectedParticipant]);

  return (
    <div
      className="w-full overflow-x-auto overscroll-x-contain pb-2"
      data-testid="ladder-board-scroll"
    >
      <div
        className="mx-auto w-full pt-2"
        style={{
          maxWidth: `${boardSize.width}px`,
          minWidth: mobileBoardMinWidth
            ? `${mobileBoardMinWidth}px`
            : undefined,
        }}
        data-testid="ladder-board"
        aria-label="사다리 게임판"
      >
        <LadderPlayerSelector
          participants={participants}
          selectedParticipant={selectedParticipant}
          onSelectParticipant={onSelectParticipant}
          shortenLabel={shortenLabel}
        />

        <LadderRouteCanvas
          ladder={ladder}
          participants={participants}
          selectedParticipant={selectedParticipant}
          selectedStyle={selectedStyle}
          boardSize={boardSize}
          viewportHeight={viewportHeight}
          fullPath={fullPath}
          routePoints={routePoints}
          routeDuration={routeDuration}
          onRouteComplete={completeRoute}
        />

        <LadderResultSlots
          results={results}
          selectedDestination={selectedDestination}
          shortenLabel={shortenLabel}
        />
      </div>
    </div>
  );
};
