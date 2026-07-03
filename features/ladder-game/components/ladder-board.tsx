"use client";

import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import type { Ladder, LadderRoutePoint } from "../model/ladder";
import {
  createLadderRoute,
  getLadderDestination,
} from "../utils/ladder";

const CELL_SIZE = 72;
const STEP_DURATION_MS = 240;

const PLAYER_STYLES = [
  { stroke: "var(--player-1)", foreground: "text-white" },
  { stroke: "var(--player-2)", foreground: "text-game-ink" },
  { stroke: "var(--player-3)", foreground: "text-white" },
  { stroke: "var(--player-4)", foreground: "text-game-ink" },
  { stroke: "var(--player-5)", foreground: "text-game-ink" },
  { stroke: "var(--player-6)", foreground: "text-white" },
  { stroke: "var(--player-7)", foreground: "text-white" },
  { stroke: "var(--player-8)", foreground: "text-white" },
  { stroke: "var(--player-9)", foreground: "text-white" },
  { stroke: "var(--player-10)", foreground: "text-white" },
] as const;

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

function getBoardSize(ladder: Ladder) {
  return {
    width: ladder.playerCount * CELL_SIZE,
    height: ladder.levelCount * CELL_SIZE,
  };
}

function getPointPosition(point: LadderRoutePoint) {
  return {
    x: (point.column + 0.5) * CELL_SIZE,
    y: point.row * CELL_SIZE,
  };
}

function createPath(points: LadderRoutePoint[]) {
  return points
    .map((point, index) => {
      const position = getPointPosition(point);
      return `${index === 0 ? "M" : "L"} ${position.x} ${position.y}`;
    })
    .join(" ");
}

function shortenLabel(value: string) {
  return value.length > 8 ? `${value.slice(0, 7)}…` : value;
}

export function LadderBoard({
  ladder,
  participants,
  results,
  selectedParticipant,
  onSelectParticipant,
  onRouteComplete,
}: LadderBoardProps) {
  const routePoints = useMemo(
    () =>
      selectedParticipant === null
        ? []
        : createLadderRoute(ladder, selectedParticipant),
    [ladder, selectedParticipant],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const boardSize = getBoardSize(ladder);
  const currentPoint = routePoints[currentStep];
  const selectedStyle =
    selectedParticipant === null
      ? null
      : PLAYER_STYLES[selectedParticipant % PLAYER_STYLES.length];
  const isComplete =
    routePoints.length > 0 && currentStep === routePoints.length - 1;
  const selectedDestination =
    selectedParticipant !== null && isComplete
      ? getLadderDestination(ladder, selectedParticipant)
      : null;
  const completedPath =
    currentStep > 1 ? createPath(routePoints.slice(0, currentStep)) : null;
  const activePath =
    currentStep > 0
      ? createPath(routePoints.slice(currentStep - 1, currentStep + 1))
      : null;
  const mobileBoardMinWidth =
    ladder.playerCount > 6 ? ladder.playerCount * 56 : undefined;

  useEffect(() => {
    if (selectedParticipant === null || routePoints.length < 2) {
      return;
    }

    let nextStep = 1;
    const intervalId = window.setInterval(() => {
      setCurrentStep(nextStep);

      if (nextStep === routePoints.length - 1) {
        window.clearInterval(intervalId);
        onRouteComplete(
          selectedParticipant,
          getLadderDestination(ladder, selectedParticipant),
        );
      }

      nextStep += 1;
    }, STEP_DURATION_MS);

    return () => window.clearInterval(intervalId);
  }, [ladder, onRouteComplete, routePoints, selectedParticipant]);

  return (
    <div
      className="w-full overflow-x-auto overscroll-x-contain pb-2"
      data-testid="ladder-board-scroll"
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: `${boardSize.width}px`,
          minWidth: mobileBoardMinWidth
            ? `${mobileBoardMinWidth}px`
            : undefined,
        }}
        data-testid="ladder-board"
        aria-label="사다리 게임판"
      >
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${ladder.playerCount}, minmax(0, 1fr))`,
          }}
        >
          {participants.map((participant, index) => (
            <Button
              key={`${participant}-${index}`}
              type="button"
              title={`${participant} 경로 확인`}
              aria-label={`${participant} 경로 확인`}
              onClick={() => onSelectParticipant(index)}
              style={{
                color: "var(--game-ink)",
              }}
              className={cn(
                "h-auto min-w-0 flex-col gap-2 bg-transparent p-0 text-[11px] font-bold hover:bg-transparent sm:text-xs",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-md border border-game-ink font-mono text-sm font-black transition-transform sm:size-11",
                  PLAYER_STYLES[index % PLAYER_STYLES.length].foreground,
                  selectedParticipant === index &&
                    "-translate-y-1 ring-4 ring-game-acid",
                )}
                style={{
                  backgroundColor:
                    PLAYER_STYLES[index % PLAYER_STYLES.length].stroke,
                }}
              >
                <Play className="size-3" aria-hidden="true" />
              </span>
              <span className="truncate">{shortenLabel(participant)}</span>
            </Button>
          ))}
        </div>

        <div className="mt-4 border-y border-game-ink/20 bg-white p-3 sm:p-5">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${boardSize.width} / ${boardSize.height}`,
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}
              role="img"
              aria-label={
                selectedParticipant === null
                  ? "선택을 기다리는 사다리"
                  : `${participants[selectedParticipant]}의 경로`
              }
              preserveAspectRatio="none"
            >
            {Array.from(
              { length: ladder.playerCount + 1 },
              (_, boundary) => (
                <line
                  key={`grid-column-${boundary}`}
                  x1={boundary * CELL_SIZE}
                  x2={boundary * CELL_SIZE}
                  y1="0"
                  y2={boardSize.height}
                  stroke="var(--game-grid)"
                  strokeDasharray="3 5"
                  strokeWidth="0.75"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}
            {Array.from(
              { length: ladder.levelCount + 1 },
              (_, boundary) => (
                <line
                  key={`grid-row-${boundary}`}
                  x1="0"
                  x2={boardSize.width}
                  y1={boundary * CELL_SIZE}
                  y2={boundary * CELL_SIZE}
                  stroke="var(--game-grid)"
                  strokeDasharray="3 5"
                  strokeWidth="0.75"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}

            {participants.map((participant, column) => (
              <line
                key={`vertical-${participant}-${column}`}
                x1={(column + 0.5) * CELL_SIZE}
                x2={(column + 0.5) * CELL_SIZE}
                y1="0"
                y2={boardSize.height}
                stroke="var(--game-ink)"
                strokeLinecap="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {ladder.bridges.map((bridge) => {
              const y = (bridge.level + 1) * CELL_SIZE;

              return (
                <line
                  key={`${bridge.level}-${bridge.leftColumn}`}
                  x1={(bridge.leftColumn + 0.5) * CELL_SIZE}
                  x2={(bridge.leftColumn + 1.5) * CELL_SIZE}
                  y1={y}
                  y2={y}
                  stroke="var(--game-ink)"
                  strokeLinecap="round"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {completedPath && selectedStyle ? (
              <path
                d={completedPath}
                fill="none"
                stroke={selectedStyle.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="9"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            {activePath && selectedStyle ? (
              <path
                key={`step-${currentStep}`}
                className="ladder-step-motion"
                d={activePath}
                fill="none"
                pathLength="1"
                stroke={selectedStyle.stroke}
                strokeDasharray="1"
                strokeDashoffset="1"
                strokeLinecap="round"
                strokeWidth="9"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            </svg>

            {selectedParticipant !== null && currentPoint && selectedStyle ? (
              <div
                data-testid="ladder-token"
                className="absolute z-10 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md border-2 border-white font-mono text-xs font-black text-white shadow-[0_4px_12px_rgb(0_0_0/0.22)] transition-[left,top] ease-linear motion-reduce:transition-none"
                style={{
                  left: `${(getPointPosition(currentPoint).x / boardSize.width) * 100}%`,
                  top: `${(getPointPosition(currentPoint).y / boardSize.height) * 100}%`,
                  backgroundColor: selectedStyle.stroke,
                  transitionDuration: `${STEP_DURATION_MS}ms`,
                }}
                aria-hidden="true"
              >
                {selectedParticipant + 1}
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="grid gap-px bg-game-ink"
          style={{
            gridTemplateColumns: `repeat(${ladder.playerCount}, minmax(0, 1fr))`,
          }}
        >
          {results.map((result, index) => (
            <div
              key={`${result}-${index}`}
              title={result}
              className={cn(
                "flex min-h-14 min-w-0 flex-col items-center justify-center bg-game-paper px-1 py-2 text-center text-[11px] font-bold transition-colors sm:min-h-16 sm:text-xs",
                selectedDestination === index &&
                  "bg-game-acid text-game-ink",
              )}
            >
              <span className="mb-1 font-mono text-[9px] opacity-60">
                SLOT {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{shortenLabel(result)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
