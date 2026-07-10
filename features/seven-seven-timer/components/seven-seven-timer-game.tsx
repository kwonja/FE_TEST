"use client";

import { ArrowLeft, Clock3, Dices, RotateCcw, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  TIMER_TARGET_SECONDS,
  TIMER_TICK_INTERVAL_MS,
  type SevenSevenTimerPhase,
} from "@/features/seven-seven-timer/model/seven-seven-timer";
import {
  formatTimerSeconds,
  getTimerDifference,
  getTimerResultMessage,
} from "@/features/seven-seven-timer/utils/seven-seven-timer";

const clearTimer = (timerId: number | null) => {
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
};

export const SevenSevenTimerGame = () => {
  const [phase, setPhase] = useState<SevenSevenTimerPhase>("READY");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resultSeconds, setResultSeconds] = useState<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);

  const getElapsedSeconds = () => {
    if (startedAtRef.current === null) {
      return 0;
    }

    return Math.max(0, (performance.now() - startedAtRef.current) / 1000);
  };

  useEffect(() => {
    if (phase !== "RUNNING") {
      return;
    }

    const updateElapsedSeconds = () => {
      setElapsedSeconds(getElapsedSeconds());
    };

    updateElapsedSeconds();
    timerIdRef.current = window.setInterval(
      updateElapsedSeconds,
      TIMER_TICK_INTERVAL_MS,
    );

    return () => {
      clearTimer(timerIdRef.current);
      timerIdRef.current = null;
    };
  }, [phase]);

  const startTimer = () => {
    startedAtRef.current = performance.now();
    setElapsedSeconds(0);
    setResultSeconds(null);
    setPhase("RUNNING");
  };

  const stopTimer = () => {
    if (phase !== "RUNNING") {
      return;
    }

    const nextResult = getElapsedSeconds();
    setElapsedSeconds(nextResult);
    setResultSeconds(nextResult);
    setPhase("RESULT");
  };

  const displayedSeconds =
    phase === "RESULT" && resultSeconds !== null
      ? resultSeconds
      : elapsedSeconds;
  const difference = resultSeconds === null ? null : getTimerDifference(resultSeconds);

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
            <Clock3 className="size-4" aria-hidden="true" />
            GAME 004 / STOPWATCH
          </p>
          <h1 className="text-4xl font-black leading-none sm:text-6xl">
            3.33 맞추기
          </h1>
        </div>

        <div className="grid overflow-hidden rounded-md border-2 border-game-ink bg-white shadow-[5px_5px_0_var(--game-ink)] sm:shadow-[8px_8px_0_var(--game-ink)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex min-h-[430px] flex-col bg-game-sky p-4 sm:min-h-[560px] sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p
                className="font-mono text-xs font-black tracking-[0.18em]"
                data-testid="seven-seven-phase"
              >
                {phase}
              </p>
              <span className="rounded-full border-2 border-game-ink bg-white px-3 py-1 text-xs font-black">
                목표 {formatTimerSeconds(TIMER_TARGET_SECONDS)}
              </span>
            </div>

            <button
              type="button"
              className={`game-pressable grid flex-1 place-items-center rounded-md border-[6px] border-game-ink p-6 text-center shadow-[6px_6px_0_var(--game-ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral sm:shadow-[10px_10px_0_var(--game-ink)] ${
                phase === "RUNNING"
                  ? "bg-game-coral text-white"
                  : "bg-white text-game-ink"
              }`}
              onClick={stopTimer}
              disabled={phase !== "RUNNING"}
              data-testid="seven-seven-stop-button"
            >
              <span>
                <span
                  className="block font-mono text-7xl font-black leading-none tabular-nums sm:text-9xl"
                  data-testid="seven-seven-display"
                >
                  {formatTimerSeconds(displayedSeconds)}
                </span>
                <span className="mt-5 block text-base font-black sm:text-xl">
                  {phase === "RUNNING"
                    ? "3.33초에 맞춰 여기를 누르세요"
                    : "시작한 뒤 목표 시간에 맞춰 멈추세요"}
                </span>
              </span>
            </button>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="game-pressable flex min-h-14 w-full items-center justify-center gap-2 rounded-md border-2 border-game-ink bg-game-ink px-6 text-lg font-black text-white shadow-[5px_5px_0_var(--game-coral)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-wait disabled:opacity-70 sm:max-w-xs"
                disabled={phase === "RUNNING"}
                onClick={startTimer}
                data-testid="seven-seven-start-button"
              >
                <RotateCcw className="size-5" aria-hidden="true" />
                {phase === "READY" ? "시작하기" : "다시 도전"}
              </button>
              <p className="text-sm font-bold">
                타이머 숫자는 0.01초 단위로 계속 갱신됩니다.
              </p>
            </div>
          </section>

          <aside className="border-t-2 border-game-ink bg-game-ink p-6 text-white lg:border-t-0 lg:border-l-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary">
              TARGET CHECK
            </p>
            <h2 className="mt-1 text-2xl font-black">결과</h2>
            <div className="mt-6 rounded-md border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-bold text-white/60">목표 시간</p>
              <p className="mt-1 flex items-center gap-2 text-4xl font-black tabular-nums">
                <Target className="size-7 text-primary" aria-hidden="true" />
                3.33s
              </p>
            </div>

            <div className="mt-4 rounded-md border border-white/20 bg-white/10 p-4">
              <p className="text-xs font-bold text-white/60">오차</p>
              <p
                className="mt-1 text-4xl font-black tabular-nums"
                data-testid="seven-seven-difference"
              >
                {difference === null ? "--" : formatTimerSeconds(difference)}
              </p>
            </div>

            <p
              className="mt-6 border border-dashed border-white/40 p-4 text-sm leading-6 text-white/80"
              data-testid="seven-seven-result-message"
              role="status"
              aria-live="polite"
            >
              {resultSeconds === null
                ? "시작 버튼을 누르고 3.33초에 맞춰 큰 타이머를 멈춰 보세요."
                : getTimerResultMessage(resultSeconds)}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};
