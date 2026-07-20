"use client";

import {
  ArrowLeft,
  Dices,
  Minus,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import {
  MAX_LADDER_PLAYERS,
  MIN_LADDER_PLAYERS,
  type LadderGameSnapshot,
} from "../model/ladder";
import { generateLadder } from "../utils/ladder";
import { LadderBoard } from "./ladder-board";

const DEFAULT_PARTICIPANTS = ["성민", "주현", "민준", "재석"];
const DEFAULT_RESULTS = ["커피 사기", "간식 당첨", "오늘 면제", "정리 담당"];
const INITIAL_SEED = 20260702;

const requestNotificationPermission = () => {
  if (typeof Notification === "undefined" || Notification.permission !== "default") {
    return;
  }

  void Notification.requestPermission();
};

const showGameNotification = (body: string) => {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }

  new Notification("사다리 게임 결과", { body });
};

const createSnapshot = (
  participants: string[],
  results: string[],
  seed: number,
): LadderGameSnapshot => {
  return {
    participants,
    results,
    ladder: generateLadder(participants.length, seed),
  };
};

const validateEntries = (participants: string[], results: string[]) => {
  if (
    participants.some((participant) => participant.trim().length === 0) ||
    results.some((result) => result.trim().length === 0)
  ) {
    return "참가자와 결과를 모두 입력해 주세요.";
  }

  const normalizedParticipants = participants.map((participant) =>
    participant.trim(),
  );

  if (new Set(normalizedParticipants).size !== normalizedParticipants.length) {
    return "참가자 이름은 서로 다르게 입력해 주세요.";
  }

  return null;
};

export const LadderGame = () => {
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [results, setResults] = useState(DEFAULT_RESULTS);
  const [snapshot, setSnapshot] = useState(() =>
    createSnapshot(DEFAULT_PARTICIPANTS, DEFAULT_RESULTS, INITIAL_SEED),
  );
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(
    null,
  );
  const [isPreparing, setIsPreparing] = useState(true);
  const [animationRunId, setAnimationRunId] = useState(0);
  const [message, setMessage] = useState(
    "위쪽 참가자를 선택하면 경로가 시작됩니다.",
  );
  const [error, setError] = useState<string | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<string | null>(null);
  const [hasStartedGame, setHasStartedGame] = useState(false);
  const gameAreaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSnapshot(
        createSnapshot(DEFAULT_PARTICIPANTS, DEFAULT_RESULTS, Date.now()),
      );
      setIsPreparing(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasStartedGame || isPreparing) {
      return;
    }

    gameAreaRef.current
      ?.querySelector<HTMLButtonElement>(
        '[data-testid="ladder-player-select"]',
      )
      ?.focus();
  }, [hasStartedGame, isPreparing]);

  const updateEntry = (
    type: "participant" | "result",
    index: number,
    value: string,
  ) => {
    if (type === "participant") {
      const nextParticipants = participants.map((entry, entryIndex) =>
        entryIndex === index ? value : entry,
      );
      setParticipants(nextParticipants);
      setSnapshot((current) => ({
        ...current,
        participants: nextParticipants,
      }));
      return;
    }

    const nextResults = results.map((entry, entryIndex) =>
      entryIndex === index ? value : entry,
    );
    setResults(nextResults);
    setSnapshot((current) => ({
      ...current,
      results: nextResults,
    }));
  };

  const addEntry = () => {
    if (participants.length >= MAX_LADDER_PLAYERS) {
      return;
    }

    const nextNumber = participants.length + 1;
    const nextParticipants = [...participants, `참가자 ${nextNumber}`];
    const nextResults = [...results, `결과 ${nextNumber}`];

    setParticipants(nextParticipants);
    setResults(nextResults);
    setSnapshot(createSnapshot(nextParticipants, nextResults, Date.now()));
    setSelectedParticipant(null);
    setAnimationRunId((current) => current + 1);
    setMessage(`${nextNumber}명 사다리가 바로 반영됐습니다.`);
    setArrivalMessage(null);
    setError(null);
  };

  const removeEntry = (index: number) => {
    if (participants.length <= MIN_LADDER_PLAYERS) {
      return;
    }

    const nextParticipants = participants.filter(
      (_, entryIndex) => entryIndex !== index,
    );
    const nextResults = results.filter((_, entryIndex) => entryIndex !== index);

    setParticipants(nextParticipants);
    setResults(nextResults);
    setSnapshot(createSnapshot(nextParticipants, nextResults, Date.now()));
    setSelectedParticipant(null);
    setAnimationRunId((current) => current + 1);
    setMessage(`${nextParticipants.length}명 사다리가 바로 반영됐습니다.`);
    setArrivalMessage(null);
    setError(null);
  };

  const enterGame = () => {
    requestNotificationPermission();
    setMessage(
      isPreparing
        ? "사다리를 섞는 중입니다."
        : "위쪽 참가자를 선택하면 경로가 시작됩니다.",
    );
    setHasStartedGame(true);
  };

  const createNewLadder = () => {
    const validationError = validateEntries(participants, results);

    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanParticipants = participants.map((participant) =>
      participant.trim(),
    );
    const cleanResults = results.map((result) => result.trim());
    const nextSnapshot = createSnapshot(
      cleanParticipants,
      cleanResults,
      Date.now(),
    );

    setParticipants(cleanParticipants);
    setResults(cleanResults);
    setSnapshot(nextSnapshot);
    setSelectedParticipant(null);
    setAnimationRunId((current) => current + 1);
    setMessage("새 사다리가 준비됐어요. 참가자를 선택하세요.");
    setArrivalMessage(null);
    setError(null);
  };

  const shuffleLadder = () => {
    setSnapshot((current) =>
      createSnapshot(
        current.participants,
        current.results,
        current.ladder.seed + 1,
      ),
    );
    setSelectedParticipant(null);
    setAnimationRunId((current) => current + 1);
    setMessage("사다리를 다시 섞었습니다.");
    setArrivalMessage(null);
  };

  const resetGame = () => {
    setParticipants(DEFAULT_PARTICIPANTS);
    setResults(DEFAULT_RESULTS);
    setSnapshot(
      createSnapshot(DEFAULT_PARTICIPANTS, DEFAULT_RESULTS, INITIAL_SEED),
    );
    setSelectedParticipant(null);
    setAnimationRunId((current) => current + 1);
    setMessage("처음 상태로 돌아왔습니다.");
    setArrivalMessage(null);
    setError(null);
  };

  const selectParticipant = (participantIndex: number) => {
    setSelectedParticipant(participantIndex);
    setAnimationRunId((current) => current + 1);
    setMessage(`${snapshot.participants[participantIndex]}이(가) 이동 중입니다.`);
    setArrivalMessage(null);
  };

  const completeRoute = useCallback(
    (participantIndex: number, destinationIndex: number) => {
      const nextArrivalMessage = `${snapshot.participants[participantIndex]}이(가) 도착한 결과는 '${snapshot.results[destinationIndex]}'입니다.`;

      setMessage(nextArrivalMessage);
      setArrivalMessage(nextArrivalMessage);
      showGameNotification(nextArrivalMessage);
    },
    [snapshot.participants, snapshot.results],
  );

  return (
    <main className="min-h-screen bg-primary text-game-ink">
      <header className="border-b border-white/10 bg-game-ink text-white">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between px-4 sm:px-7">
          <Link href="/" className="flex items-center gap-2 font-black">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Dices className="size-5" aria-hidden="true" />
            </span>
            한판
          </Link>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="ghost"
            className="game-pressable font-bold text-white hover:bg-primary hover:text-primary-foreground"
            aria-label="게임 목록으로 돌아가기"
          >
            <ArrowLeft aria-hidden="true" />
            게임 목록
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 sm:py-12">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-black tracking-[0.14em]">
              <Sparkles className="size-4" aria-hidden="true" />
              GAME 001 / LADDER
            </div>
            <h1 className="text-4xl font-black leading-none sm:text-6xl">
              사다리 타기
            </h1>
          </div>
          <div className="hidden items-center gap-2 font-mono text-xs font-bold tracking-[0.14em] sm:flex">
            <span className="size-3 bg-game-mint" aria-hidden="true" />
            GRID / MOVE / ARRIVE
          </div>
        </div>

        <div className="grid overflow-hidden rounded-md border border-game-ink/20 bg-white shadow-[0_16px_48px_rgb(40_31_64/0.16)] sm:shadow-[0_22px_70px_rgb(40_31_64/0.2)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 bg-game-ink p-4 text-white sm:p-5 xl:min-h-[720px] xl:border-r xl:border-b-0 xl:border-white/10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary">
                  CONTROL DECK
                </p>
                <h2 className="mt-1 text-lg font-black">게임 설정</h2>
                <p className="mt-1 text-xs text-white/60">
                  {participants.length}명 참여
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="game-icon-pressable text-white hover:bg-white/15 hover:text-white"
                title="처음 상태로 되돌리기"
                aria-label="처음 상태로 되돌리기"
                onClick={resetGame}
              >
                <RotateCcw aria-hidden="true" />
              </Button>
            </div>

            <div className="mb-2 hidden grid-cols-[1fr_1fr_40px] gap-2 px-1 text-xs font-bold text-primary sm:grid">
              <span>참가자</span>
              <span>결과</span>
              <span className="sr-only">삭제</span>
            </div>

            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[minmax(0,1fr)_40px] gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px]"
                >
                  <Label htmlFor={`participant-${index}`} className="sr-only">
                    참가자 {index + 1}
                  </Label>
                  <Input
                    id={`participant-${index}`}
                    data-testid="ladder-participant-input"
                    value={participant}
                    maxLength={20}
                    className="col-start-1 row-start-1 h-9 border-white/25 bg-white/95 text-game-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] transition-[border-color,box-shadow,background-color] duration-150 focus-visible:bg-white sm:col-auto sm:row-auto"
                    onChange={(event) =>
                      updateEntry("participant", index, event.target.value)
                    }
                  />
                  <Label htmlFor={`result-${index}`} className="sr-only">
                    결과 {index + 1}
                  </Label>
                  <Input
                    id={`result-${index}`}
                    data-testid="ladder-result-input"
                    value={results[index]}
                    maxLength={24}
                    className="col-start-1 row-start-2 h-9 border-white/25 bg-white/95 text-game-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] transition-[border-color,box-shadow,background-color] duration-150 focus-visible:bg-white sm:col-auto sm:row-auto"
                    onChange={(event) =>
                      updateEntry("result", index, event.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="game-icon-pressable col-start-2 row-span-2 row-start-1 size-10 text-white hover:bg-white/15 hover:text-white sm:col-auto sm:row-auto sm:row-span-1"
                    title={`${participant || `참가자 ${index + 1}`} 삭제`}
                    aria-label={`${participant || `참가자 ${index + 1}`} 삭제`}
                    disabled={participants.length <= MIN_LADDER_PLAYERS}
                    onClick={() => removeEntry(index)}
                  >
                    <Minus aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="game-pressable mt-3 w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              disabled={participants.length >= MAX_LADDER_PLAYERS}
              onClick={addEntry}
            >
              <Plus aria-hidden="true" />
              참가자 추가
            </Button>

            {error ? (
              <p
                className="mt-3 text-sm font-semibold text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="button"
              className="game-pressable mt-5 h-11 w-full bg-primary text-base font-black text-primary-foreground shadow-[0_8px_24px_rgb(183_151_245/0.28)] hover:bg-primary/90"
              onClick={createNewLadder}
            >
              <Sparkles aria-hidden="true" />
              새 사다리 만들기
            </Button>
          </aside>

          <section
            ref={gameAreaRef}
            className="min-w-0 bg-white p-4 sm:p-7 lg:p-10"
          >
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-game-ink/15 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 font-mono text-[10px] font-bold tracking-[0.16em] text-muted-foreground">
                  LIVE STATUS
                </p>
                <p
                  className="min-h-6 text-sm font-black sm:text-base"
                  aria-live="polite"
                  data-testid="ladder-result-message"
                >
                  {hasStartedGame
                    ? message
                    : "참가자와 결과를 확인한 뒤 게임을 시작하세요."}
                </p>
              </div>
              {hasStartedGame ? (
                <Button
                  type="button"
                  variant="outline"
                  className="game-pressable self-start border border-game-ink bg-game-acid font-black text-game-ink shadow-[0_8px_20px_rgb(20_33_31/0.08)] hover:bg-game-acid/80 sm:self-auto"
                  onClick={shuffleLadder}
                >
                  <Shuffle aria-hidden="true" />
                  다시 섞기
                </Button>
              ) : null}
            </div>

            {!hasStartedGame ? (
              <section
                className="relative isolate grid min-h-[620px] overflow-hidden border-y border-game-ink/20 bg-game-ink px-5 py-12 text-center text-white sm:px-10"
                data-testid="ladder-start-panel"
                aria-labelledby="ladder-start-heading"
              >
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,151,245,0.22),transparent_55%),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px]"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-4 inset-y-8 opacity-35 sm:inset-x-10"
                  aria-hidden="true"
                >
                  <div className="absolute inset-x-0 top-0 flex justify-between gap-2">
                    {snapshot.participants.map((participant, index) => (
                      <div
                        key={`${participant}-${index}`}
                        className="flex min-w-0 flex-1 flex-col items-center gap-2"
                      >
                        <span className="grid size-9 place-items-center rounded-full border border-primary/60 bg-primary/15 font-mono text-xs font-black text-primary sm:size-11">
                          {index + 1}
                        </span>
                        <span className="max-w-full truncate text-[10px] font-bold text-white/60 sm:text-xs">
                          {participant}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-[7%] bottom-16 top-16">
                    <div className="flex h-full justify-between px-[7%]">
                      {snapshot.participants.map((participant, index) => (
                        <span
                          key={`${participant}-line-${index}`}
                          className="h-full w-px bg-primary/55"
                        />
                      ))}
                    </div>
                    {snapshot.ladder.bridges.map((bridge) => {
                      const columnGap =
                        86 / (snapshot.ladder.playerCount - 1);

                      return (
                        <span
                          key={`${bridge.row}-${bridge.leftColumn}`}
                          data-testid="ladder-preview-rung"
                          className="absolute h-px bg-game-acid/60"
                          style={{
                            left: `${7 + bridge.leftColumn * columnGap}%`,
                            top: `${
                              (bridge.row / snapshot.ladder.rowCount) * 100
                            }%`,
                            width: `${columnGap}%`,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2">
                    {snapshot.results.map((result, index) => (
                      <div
                        key={`${result}-${index}`}
                        className="min-w-0 flex-1 rounded-sm border border-game-acid/50 bg-game-acid/10 px-1 py-2 text-[10px] font-bold text-game-acid/70 sm:px-2 sm:text-xs"
                      >
                        <span className="block truncate">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,31,64,0.62),rgba(40,31,64,0.25)_30%,rgba(40,31,64,0.25)_70%,rgba(40,31,64,0.62))]" aria-hidden="true" />
                <div className="relative z-10 m-auto w-full max-w-[560px] py-10">
                  <p className="font-mono text-xs font-black tracking-[0.18em] text-primary">
                    READY / SET / GO
                  </p>
                  <h2
                    id="ladder-start-heading"
                    className="mt-4 text-3xl font-black leading-tight drop-shadow-[0_3px_18px_rgb(40_31_64)] sm:text-5xl"
                  >
                    오늘의 운명을 사다리로 정해볼까요?
                  </h2>
                  <p
                    id="ladder-start-description"
                    className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base"
                  >
                    시작하면 참가자를 선택해 결과까지의 경로를 확인할 수 있어요.
                  </p>
                  <Button
                    type="button"
                    className="game-pressable mt-7 h-12 w-full bg-game-acid text-base font-black text-game-ink hover:bg-game-acid/80"
                    aria-describedby="ladder-start-description ladder-notification-description"
                    onClick={enterGame}
                  >
                    <Sparkles aria-hidden="true" />
                    사다리 게임 시작!
                  </Button>
                  <p
                    id="ladder-notification-description"
                    className="mt-3 text-xs leading-5 text-white/60"
                  >
                    브라우저 알림은 선택 사항이에요. 허용하면 게임 결과를 알려드려요.
                  </p>
                </div>
              </section>
            ) : isPreparing ? (
              <div
                className="grid min-h-[620px] place-items-center border-y border-game-ink/20 bg-game-paper px-5 text-center"
                data-testid="ladder-preparing"
                role="status"
              >
                <div>
                  <Shuffle
                    className="mx-auto mb-3 size-8 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <p className="font-black">사다리를 섞는 중입니다.</p>
                </div>
              </div>
            ) : (
              <div className="min-h-[620px]">
                <LadderBoard
                  key={`${snapshot.ladder.seed}-${animationRunId}`}
                  ladder={snapshot.ladder}
                  participants={snapshot.participants}
                  results={snapshot.results}
                  selectedParticipant={selectedParticipant}
                  onSelectParticipant={selectParticipant}
                  onRouteComplete={completeRoute}
                />
              </div>
            )}

            {arrivalMessage ? (
              <div className="mt-8 grid overflow-hidden rounded-md border border-game-ink bg-game-ink text-white shadow-[0_10px_28px_rgb(20_33_31/0.12)] sm:grid-cols-[140px_1fr]">
                <div className="flex items-center bg-game-acid px-5 py-4 font-mono text-xs font-black tracking-[0.16em] text-game-ink">
                  ARRIVAL
                </div>
                <p className="px-5 py-4 text-base font-black sm:text-lg">
                  {arrivalMessage}
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
};
