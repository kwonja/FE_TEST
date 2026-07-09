"use client";

import { ArrowLeft, Dices, Sparkles } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import {
  REACTION_MAX_HISTORY,
  REACTION_MAX_WAIT_MS,
  REACTION_MIN_WAIT_MS,
  type ReactionPhase,
} from "@/features/reaction-speed/model/reaction-speed";
import {
  formatReactionTime,
  getRandomWaitDuration,
} from "@/features/reaction-speed/utils/reaction-speed";

const phaseLabels: Record<ReactionPhase, string> = {
  READY: "준비",
  WAITING: "대기 중",
  SIGNAL: "지금!",
  RESULT: "결과",
  TOO_EARLY: "너무 빠름",
};

const getResultComment = (milliseconds: number) => {
  if (milliseconds < 180) {
    return "엄청 빠릅니다. 거의 예지력 쪽이에요.";
  }

  if (milliseconds < 250) {
    return "빠른 반응입니다. 손이 먼저 움직였네요.";
  }

  if (milliseconds < 350) {
    return "좋은 반응속도입니다. 한 번 더 줄여볼까요?";
  }

  return "아직 몸이 예열 중입니다. 다시 도전해보세요.";
};

const clearReactionTimer = (timer: number | null) => {
  if (timer) {
    window.clearTimeout(timer);
  }
};

export const ReactionSpeedGame = () => {
  const [phase, setPhase] = useState<ReactionPhase>("READY");
  const [resultMs, setResultMs] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [message, setMessage] = useState(
    "시작하면 화면이 바뀔 때까지 기다리세요.",
  );
  const signalTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hasReactedRef = useRef(false);

  useEffect(
    () => () => {
      clearReactionTimer(timeoutRef.current);
    },
    [],
  );

  const startGame = () => {
    clearReactionTimer(timeoutRef.current);
    signalTimeRef.current = null;
    hasReactedRef.current = false;
    setResultMs(null);
    setPhase("WAITING");
    setMessage("아직 누르지 마세요. 초록 신호가 뜨면 바로 누르세요.");

    const waitDuration = getRandomWaitDuration(
      REACTION_MIN_WAIT_MS,
      REACTION_MAX_WAIT_MS,
    );

    timeoutRef.current = window.setTimeout(() => {
      signalTimeRef.current = performance.now();
      setPhase("SIGNAL");
      setMessage("지금 누르세요!");
    }, waitDuration);
  };

  const markTooEarly = () => {
    clearReactionTimer(timeoutRef.current);
    timeoutRef.current = null;
    signalTimeRef.current = null;
    hasReactedRef.current = true;
    setResultMs(null);
    setPhase("TOO_EARLY");
    setMessage("너무 빨랐어요. 신호가 뜬 뒤에 눌러야 합니다.");
  };

  const completeReaction = () => {
    if (hasReactedRef.current || signalTimeRef.current === null) {
      return;
    }

    hasReactedRef.current = true;
    const nextResult = Math.max(
      0,
      Math.round(performance.now() - signalTimeRef.current),
    );

    setResultMs(nextResult);
    setHistory((current) =>
      [nextResult, ...current].slice(0, REACTION_MAX_HISTORY),
    );
    setPhase("RESULT");
    setMessage(`반응속도는 ${formatReactionTime(nextResult)}입니다.`);
  };

  const handleReactionPointerDown = () => {
    if (phase === "WAITING") {
      markTooEarly();
      return;
    }

    if (phase === "SIGNAL") {
      completeReaction();
    }
  };

  const handleReactionKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleReactionPointerDown();
  };

  const isReactionActive = phase === "WAITING" || phase === "SIGNAL";
  const resultText = resultMs === null ? "--" : formatReactionTime(resultMs);

  return (
    <main className="min-h-screen bg-game-paper text-game-ink">
      <header className="border-b-2 border-game-ink bg-game-ink text-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-black">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Dices className="size-5" aria-hidden="true" />
            </span>
            한판
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-bold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60 sm:px-3 sm:text-base"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            게임 목록
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-12">
        <div className="mb-7">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-black tracking-[0.14em]">
            <Sparkles className="size-4" aria-hidden="true" />
            GAME 003 / REACTION SPEED
          </p>
          <h1 className="text-4xl font-black leading-none sm:text-6xl">
            반응속도 게임
          </h1>
        </div>

        <div className="grid overflow-hidden rounded-md border-2 border-game-ink bg-white shadow-[5px_5px_0_var(--game-ink)] sm:shadow-[8px_8px_0_var(--game-ink)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex min-h-[430px] flex-col bg-primary p-4 sm:min-h-[560px] sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p
                className="font-mono text-xs font-black tracking-[0.18em]"
                data-testid="reaction-speed-phase"
              >
                {phase} · {phaseLabels[phase]}
              </p>
              <span className="rounded-full border-2 border-game-ink bg-white px-3 py-1 text-xs font-black">
                pointerdown 측정
              </span>
            </div>

            {isReactionActive ? (
              <button
                type="button"
                className={`reaction-speed-pad grid flex-1 place-items-center rounded-md border-[6px] border-game-ink p-6 text-center shadow-[6px_6px_0_var(--game-ink)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral sm:shadow-[10px_10px_0_var(--game-ink)] ${
                  phase === "SIGNAL"
                    ? "reaction-speed-pad--signal bg-game-acid"
                    : "bg-game-coral text-white"
                }`}
                onPointerDown={handleReactionPointerDown}
                onKeyDown={handleReactionKeyDown}
                data-testid="reaction-speed-pad"
                aria-label={
                  phase === "SIGNAL"
                    ? "지금 누르기"
                    : "대기 중입니다. 아직 누르지 마세요."
                }
              >
                <span>
                  <span className="block text-5xl font-black leading-none sm:text-8xl">
                    {phase === "SIGNAL" ? "지금!" : "대기"}
                  </span>
                  <span className="mt-4 block text-base font-black sm:text-xl">
                    {phase === "SIGNAL"
                      ? "보는 순간 누르세요"
                      : "초록 신호가 뜰 때까지 기다리세요"}
                  </span>
                </span>
              </button>
            ) : (
              <div
                className={`reaction-speed-result grid flex-1 place-items-center rounded-md border-[6px] border-game-ink bg-white p-6 text-center shadow-[6px_6px_0_var(--game-ink)] sm:shadow-[10px_10px_0_var(--game-ink)] ${
                  phase === "RESULT" ? "reaction-speed-result--pop" : ""
                }`}
                data-testid="reaction-speed-result"
              >
                <div>
                  <p className="font-mono text-xs font-black tracking-[0.18em] text-muted-foreground">
                    BEST MOMENT
                  </p>
                  <p className="mt-3 text-7xl font-black leading-none tabular-nums sm:text-9xl">
                    {resultText}
                  </p>
                  <p className="mt-5 text-base font-black sm:text-xl">
                    {phase === "TOO_EARLY"
                      ? "성급한 손가락은 실격입니다."
                      : resultMs === null
                        ? "신호가 뜨면 바로 누르는 게임입니다."
                        : getResultComment(resultMs)}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="game-pressable min-h-14 w-full rounded-md border-2 border-game-ink bg-game-ink px-6 text-lg font-black text-white shadow-[5px_5px_0_var(--game-coral)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-wait disabled:opacity-70 sm:max-w-xs"
                disabled={isReactionActive}
                onClick={startGame}
                data-testid="reaction-speed-start-button"
              >
                {phase === "READY" ? "시작하기" : "다시 도전"}
              </button>
              <p className="text-sm font-bold">
                시작 후 너무 빨리 누르면 실패, 초록 신호 뒤 첫 입력만 기록됩니다.
              </p>
            </div>

            <p
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              data-testid="reaction-speed-status"
            >
              {message}
            </p>
          </section>

          <aside className="border-t-2 border-game-ink bg-game-ink p-6 text-white lg:border-t-0 lg:border-l-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary">
              SPEED LOG
            </p>
            <h2 className="mt-1 text-2xl font-black">최근 기록</h2>
            <div className="mt-6 rounded-md border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-bold text-white/60">현재 결과</p>
              <p
                className="mt-1 text-4xl font-black tabular-nums"
                data-testid="reaction-speed-current-result"
              >
                {resultText}
              </p>
            </div>

            {history.length === 0 ? (
              <p
                className="mt-6 border border-dashed border-white/40 p-4 text-sm text-white/65"
                data-testid="reaction-speed-empty"
              >
                아직 기록이 없습니다.
              </p>
            ) : (
              <ol className="mt-6 space-y-3" data-testid="reaction-speed-history">
                {history.map((record, index) => (
                  <li
                    key={`${record}-${index}`}
                    className="flex items-center justify-between border border-white/25 bg-white/10 px-4 py-3"
                    data-testid="reaction-speed-history-item"
                  >
                    <span className="font-mono text-xs text-primary">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="text-3xl tabular-nums">
                      {formatReactionTime(record)}
                    </strong>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};
