"use client";

import { ArrowLeft, Dices, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  DRAW_DURATION_MS,
  DRAW_MAX,
  DRAW_MIN,
  type DrawPhase,
  MAX_RECENT_RESULTS,
  SHUFFLE_INTERVAL_MS,
} from "@/features/random-draw/model/random-draw";
import { drawRandomNumber } from "@/features/random-draw/utils/draw-random-number";
import { AppToastContainer, showAppToast } from "@/shared/ui/app-toast";

const prefersReducedMotion = () => {
  if (typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const clearTimers = (timers: number[]) => {
  timers.forEach((timer) => {
    window.clearInterval(timer);
    window.clearTimeout(timer);
  });
};

export const RandomDrawGame = () => {
  const [phase, setPhase] = useState<DrawPhase>("READY");
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [announcedResult, setAnnouncedResult] = useState("");
  const [recentResults, setRecentResults] = useState<number[]>([]);
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      clearTimers(timersRef.current);
    },
    [],
  );

  const completeDraw = () => {
    try {
      const result = drawRandomNumber(DRAW_MIN, DRAW_MAX);

      setDisplayNumber(result);
      setRecentResults((current) =>
        [result, ...current].slice(0, MAX_RECENT_RESULTS),
      );
      setPhase("RESULT");
      setAnnouncedResult(`뽑힌 숫자는 ${result}입니다.`);
      showAppToast("success", {
        title: "뽑기 완료",
        description: `${result}번이 뽑혔습니다.`,
      });
    } catch {
      setPhase("READY");
      setAnnouncedResult("숫자 뽑기에 실패했습니다.");
      showAppToast("error", {
        title: "뽑기 실패",
        description: "다시 시도해 주세요.",
      });
    }
  };

  const startDraw = () => {
    if (phase === "DRAWING") {
      return;
    }

    clearTimers(timersRef.current);
    timersRef.current = [];
    setPhase("DRAWING");
    setAnnouncedResult("");

    if (prefersReducedMotion()) {
      completeDraw();
      return;
    }

    setDisplayNumber(drawRandomNumber(DRAW_MIN, DRAW_MAX));
    const intervalId = window.setInterval(() => {
      setDisplayNumber(drawRandomNumber(DRAW_MIN, DRAW_MAX));
    }, SHUFFLE_INTERVAL_MS);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      completeDraw();
    }, DRAW_DURATION_MS);
    timersRef.current = [intervalId, timeoutId];
  };

  return (
    <main className="min-h-screen bg-game-paper text-game-ink">
      <AppToastContainer />
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
            GAME 002 / RANDOM DRAW
          </p>
          <h1 className="text-4xl font-black leading-none sm:text-6xl">
            1~100 랜덤 뽑기
          </h1>
        </div>

        <div className="grid overflow-hidden rounded-md border-2 border-game-ink bg-white shadow-[5px_5px_0_var(--game-ink)] sm:shadow-[8px_8px_0_var(--game-ink)] lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="flex min-h-[400px] flex-col items-center justify-center bg-primary p-4 text-center sm:min-h-[540px] sm:p-10">
            <p
              className="font-mono text-xs font-black tracking-[0.18em]"
              data-testid="random-draw-phase"
            >
              {phase} · INCLUSIVE RANGE
            </p>
            <div
              className={`random-draw-number my-7 grid size-44 place-items-center rounded-full border-[6px] border-game-ink bg-game-acid text-6xl font-black tabular-nums sm:my-8 sm:size-72 sm:text-9xl ${phase === "DRAWING" ? "random-draw-number--shuffling" : ""}`}
              data-testid="random-draw-number"
              aria-hidden="true"
            >
              {displayNumber ?? "?"}
            </div>
            <button
              type="button"
              className="min-h-14 w-full max-w-sm rounded-md border-2 border-game-ink bg-game-ink px-6 text-lg font-black text-white shadow-[5px_5px_0_var(--game-coral)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-wait disabled:opacity-70"
              disabled={phase === "DRAWING"}
              onClick={startDraw}
              data-testid="random-draw-button"
            >
              {phase === "DRAWING" ? "숫자 섞는 중..." : "숫자 뽑기"}
            </button>
            <p className="mt-4 text-sm font-bold">
              1과 100을 포함하며, 같은 숫자가 다시 나올 수 있어요.
            </p>
            <p
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              data-testid="random-draw-status"
            >
              {announcedResult}
            </p>
          </section>

          <aside className="border-t-2 border-game-ink bg-game-ink p-6 text-white lg:border-t-0 lg:border-l-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-primary">
              RECENT RESULTS
            </p>
            <h2 className="mt-1 text-2xl font-black">최근 결과</h2>
            {recentResults.length === 0 ? (
              <p
                className="mt-8 border border-dashed border-white/40 p-4 text-sm text-white/65"
                data-testid="random-draw-empty"
              >
                아직 뽑은 숫자가 없습니다.
              </p>
            ) : (
              <ol className="mt-6 space-y-3" data-testid="random-draw-history">
                {recentResults.map((result, index) => (
                  <li
                    key={`${result}-${index}`}
                    className="flex items-center justify-between border border-white/25 bg-white/10 px-4 py-3"
                  >
                    <span className="font-mono text-xs text-primary">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="text-3xl tabular-nums">{result}</strong>
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
