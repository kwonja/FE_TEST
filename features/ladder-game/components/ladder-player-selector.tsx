import { Play } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { PLAYER_STYLES } from "./ladder-board.constants";

type LadderPlayerSelectorProps = {
  participants: string[];
  selectedParticipant: number | null;
  onSelectParticipant: (participantIndex: number) => void;
  shortenLabel: (value: string) => string;
};

export const LadderPlayerSelector = ({
  participants,
  selectedParticipant,
  onSelectParticipant,
  shortenLabel,
}: LadderPlayerSelectorProps) => {
  return (
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: `repeat(${participants.length}, minmax(0, 1fr))`,
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
          className="h-auto min-w-0 flex-col gap-2 bg-transparent p-0 text-[11px] font-bold hover:bg-transparent sm:text-xs"
        >
          <span
            className={cn(
              "game-player-trigger grid size-9 place-items-center rounded-md border border-game-ink font-mono text-sm font-black sm:size-11",
              PLAYER_STYLES[index % PLAYER_STYLES.length].foreground,
              selectedParticipant === index &&
                "ring-4 ring-game-acid shadow-[0_10px_24px_rgb(20_33_31/0.18)]",
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
  );
};
