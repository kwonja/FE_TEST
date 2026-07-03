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
import { useCallback, useState } from "react";

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

const DEFAULT_PARTICIPANTS = ["민준", "서연", "지우", "도윤"];
const DEFAULT_RESULTS = ["커피 사기", "간식 당첨", "오늘 면제", "정리 담당"];
const INITIAL_SEED = 20260702;

function createSnapshot(
  participants: string[],
  results: string[],
  seed: number,
): LadderGameSnapshot {
  return {
    participants,
    results,
    ladder: generateLadder(participants.length, seed),
  };
}

function validateEntries(participants: string[], results: string[]) {
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
}

export function LadderGame() {
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [results, setResults] = useState(DEFAULT_RESULTS);
  const [snapshot, setSnapshot] = useState(() =>
    createSnapshot(DEFAULT_PARTICIPANTS, DEFAULT_RESULTS, INITIAL_SEED),
  );
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(
    null,
  );
  const [animationRunId, setAnimationRunId] = useState(0);
  const [message, setMessage] = useState(
    "위쪽 참가자를 선택하면 경로가 시작됩니다.",
  );
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
  };

  const startGame = () => {
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
    setError(null);
  };

  const selectParticipant = (participantIndex: number) => {
    setSelectedParticipant(participantIndex);
    setAnimationRunId((current) => current + 1);
    setMessage(`${snapshot.participants[participantIndex]}이(가) 이동 중입니다.`);
  };

  const completeRoute = useCallback(
    (participantIndex: number, destinationIndex: number) => {
      setMessage(
        `${snapshot.participants[participantIndex]}이(가) 도착한 결과는 '${snapshot.results[destinationIndex]}'입니다.`,
      );
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
            className="font-bold text-white hover:bg-primary hover:text-primary-foreground"
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

        <div className="grid overflow-hidden rounded-md border border-game-ink/25 bg-white shadow-[0_14px_40px_rgb(40_31_64/0.18)] sm:shadow-[0_24px_80px_rgb(40_31_64/0.22)] xl:grid-cols-[340px_minmax(0,1fr)]">
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
                className="text-white hover:bg-white/15 hover:text-white"
                title="처음 상태로 되돌리기"
                aria-label="처음 상태로 되돌리기"
                onClick={resetGame}
              >
                <RotateCcw aria-hidden="true" />
              </Button>
            </div>

            <div className="mb-2 grid grid-cols-[1fr_1fr_32px] gap-2 px-1 text-xs font-bold text-primary">
              <span>참가자</span>
              <span>결과</span>
              <span className="sr-only">삭제</span>
            </div>

            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_32px] gap-2"
                >
                  <Label htmlFor={`participant-${index}`} className="sr-only">
                    참가자 {index + 1}
                  </Label>
                  <Input
                    id={`participant-${index}`}
                    data-testid="ladder-participant-input"
                    value={participant}
                    maxLength={20}
                    className="border-white/30 bg-white text-game-ink"
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
                    className="border-white/30 bg-white text-game-ink"
                    onChange={(event) =>
                      updateEntry("result", index, event.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/15 hover:text-white"
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
              className="mt-3 w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
              className="mt-5 h-11 w-full bg-primary text-base font-black text-primary-foreground hover:bg-primary/90"
              onClick={startGame}
            >
              <Sparkles aria-hidden="true" />
              새 사다리 만들기
            </Button>
          </aside>

          <section className="min-w-0 bg-white p-4 sm:p-7 lg:p-10">
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
                  {message}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="self-start border border-game-ink bg-game-acid font-black text-game-ink hover:bg-game-acid/80 sm:self-auto"
                onClick={shuffleLadder}
              >
                <Shuffle aria-hidden="true" />
                다시 섞기
              </Button>
            </div>

            <LadderBoard
              key={`${snapshot.ladder.seed}-${animationRunId}`}
              ladder={snapshot.ladder}
              participants={snapshot.participants}
              results={snapshot.results}
              selectedParticipant={selectedParticipant}
              onSelectParticipant={selectParticipant}
              onRouteComplete={completeRoute}
            />

            <div className="mt-8 grid overflow-hidden rounded-md border border-game-ink bg-game-ink text-white sm:grid-cols-[140px_1fr]">
              <div className="flex items-center bg-game-acid px-5 py-4 font-mono text-xs font-black tracking-[0.16em] text-game-ink">
                ARRIVAL
              </div>
              <p className="px-5 py-4 text-base font-black sm:text-lg">
                {message}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
