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
const BOARD_VERTICAL_INSET = 20;

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

const getBoardSize = (ladder: Ladder) => {
  return {
    width: ladder.playerCount * CELL_SIZE,
    height: ladder.rowCount * CELL_SIZE,
  };
};

const getPointPosition = (point: LadderRoutePoint) => {
  return {
    x: (point.column + 0.5) * CELL_SIZE,
    y: point.row * CELL_SIZE,
  };
};

const createPath = (points: LadderRoutePoint[]) => {
  return points
    .map((point, index) => {
      const position = getPointPosition(point);
      return `${index === 0 ? "M" : "L"} ${position.x} ${position.y}`;
    })
    .join(" ");
};

const shortenLabel = (value: string) => {
  return value.length > 8 ? `${value.slice(0, 7)}…` : value;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
};

export const LadderBoard = ({
  ladder,
  participants,
  results,
  selectedParticipant,
  onSelectParticipant,
  onRouteComplete,
}: LadderBoardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const routePoints = useMemo(
    () =>
      selectedParticipant === null
        ? []
        : createLadderRoute(ladder, selectedParticipant),
    [ladder, selectedParticipant],
  );
  const [isComplete, setIsComplete] = useState(false);
  const boardSize = getBoardSize(ladder);
  const viewportHeight = boardSize.height + BOARD_VERTICAL_INSET * 2;
  const selectedStyle =
    selectedParticipant === null
      ? null
      : PLAYER_STYLES[selectedParticipant % PLAYER_STYLES.length];
  const selectedDestination =
    selectedParticipant !== null && isComplete
      ? getLadderDestination(ladder, selectedParticipant)
      : null;
  const fullPath = routePoints.length > 1 ? createPath(routePoints) : null;
  const routeDuration = prefersReducedMotion
    ? 1
    : (routePoints.length - 1) * STEP_DURATION_MS;
  const mobileBoardMinWidth =
    ladder.playerCount > 6 ? ladder.playerCount * 56 : undefined;

  const completeRoute = () => {
    if (selectedParticipant === null) {
      return;
    }

    setIsComplete(true);
    onRouteComplete(
      selectedParticipant,
      getLadderDestination(ladder, selectedParticipant),
    );
  };

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

        <div className="mt-8 border-y border-game-ink/20 bg-white px-3 py-6 sm:px-5 sm:py-8">
          <div
            className="relative w-full"
            data-testid="ladder-route-animation"
            style={{
              aspectRatio: `${boardSize.width} / ${viewportHeight}`,
            }}
            onAnimationEnd={completeRoute}
          >
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 ${-BOARD_VERTICAL_INSET} ${boardSize.width} ${viewportHeight}`}
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
              { length: ladder.rowCount + 1 },
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
              const y = bridge.row * CELL_SIZE;

              return (
                <line
                  key={`${bridge.row}-${bridge.leftColumn}`}
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

            {fullPath && selectedStyle ? (
              <path
                className="ladder-route-motion"
                d={fullPath}
                data-testid="ladder-route"
                fill="none"
                pathLength="1"
                stroke={selectedStyle.stroke}
                strokeDasharray="1"
                strokeDashoffset="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="9"
                style={{ animationDuration: `${routeDuration}ms` }}
                vectorEffect="non-scaling-stroke"
              />
            ) : null}

            {selectedParticipant !== null && fullPath && selectedStyle ? (
              <g
                data-testid="ladder-token"
                aria-hidden="true"
              >
                <rect
                  x="-16"
                  y="-16"
                  width="32"
                  height="32"
                  rx="6"
                  fill={selectedStyle.stroke}
                  stroke="white"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  fill="white"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {selectedParticipant + 1}
                </text>
                <animateMotion
                  data-testid="ladder-token-motion"
                  path={fullPath}
                  dur={`${routeDuration}ms`}
                  calcMode="linear"
                  fill="freeze"
                />
              </g>
            ) : null}
            </svg>
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
};
