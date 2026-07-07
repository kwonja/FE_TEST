import { cn } from "@/shared/lib/utils";

type LadderResultSlotsProps = {
  results: string[];
  selectedDestination: number | null;
  shortenLabel: (value: string) => string;
};

export const LadderResultSlots = ({
  results,
  selectedDestination,
  shortenLabel,
}: LadderResultSlotsProps) => {
  return (
    <div
      className="grid gap-px bg-game-ink"
      style={{
        gridTemplateColumns: `repeat(${results.length}, minmax(0, 1fr))`,
      }}
    >
      {results.map((result, index) => (
        <div
          key={`${result}-${index}`}
          title={result}
          className={cn(
            "flex min-h-14 min-w-0 flex-col items-center justify-center bg-game-paper px-1 py-2 text-center text-[11px] font-bold transition-colors duration-150 ease-out sm:min-h-16 sm:text-xs",
            selectedDestination === index && "bg-game-acid text-game-ink",
          )}
        >
          <span className="mb-1 font-mono text-[9px] opacity-60">
            SLOT {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate">{shortenLabel(result)}</span>
        </div>
      ))}
    </div>
  );
};
