"use client";

import { ArrowLeft, Dices, RotateCcw, Send, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  INITIAL_CONSONANT_QUESTIONS,
  ROUND_DURATION_MS,
  TIMER_TICK_INTERVAL_MS,
  type InitialConsonantGamePhase,
} from "@/features/initial-consonant-game/model/initial-consonant-game";
import {
  isAcceptedAnswer,
  pickNextQuestion,
} from "@/features/initial-consonant-game/utils/initial-consonant-game";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

const INITIAL_QUESTION = INITIAL_CONSONANT_QUESTIONS[0];

export const InitialConsonantGame = () => {
  const [phase, setPhase] = useState<InitialConsonantGamePhase>("READY");
  const [question, setQuestion] = useState(INITIAL_QUESTION);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [remainingMs, setRemainingMs] = useState(ROUND_DURATION_MS);
  const [feedback, setFeedback] = useState(
    "시작 버튼을 누르면 5초 타이머가 시작됩니다.",
  );
  const [hasAnswerError, setHasAnswerError] = useState(false);
  const deadlineRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const finishGame = useCallback(() => {
    deadlineRef.current = null;
    setRemainingMs(0);
    setPhase("GAME_OVER");
    setFeedback("시간이 끝났습니다. 최종 점수를 확인하세요.");
  }, []);

  useEffect(() => {
    if (phase !== "PLAYING") {
      return;
    }

    inputRef.current?.focus();

    const updateTimer = () => {
      const deadline = deadlineRef.current;

      if (deadline === null) {
        return;
      }

      const nextRemainingMs = Math.max(0, deadline - performance.now());
      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs === 0) {
        finishGame();
      }
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, TIMER_TICK_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [finishGame, phase]);

  const startGame = () => {
    const nextQuestion =
      phase === "READY"
        ? pickNextQuestion(INITIAL_CONSONANT_QUESTIONS)
        : pickNextQuestion(INITIAL_CONSONANT_QUESTIONS, question.initials);

    deadlineRef.current = performance.now() + ROUND_DURATION_MS;
    setQuestion(nextQuestion);
    setAnswer("");
    setScore(0);
    setRemainingMs(ROUND_DURATION_MS);
    setHasAnswerError(false);
    setFeedback("게임 시작! 두 글자 단어를 입력하세요.");
    setPhase("PLAYING");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (phase !== "PLAYING" || isComposingRef.current) {
      return;
    }

    const deadline = deadlineRef.current;

    if (deadline === null || performance.now() >= deadline) {
      finishGame();
      return;
    }

    if (!isAcceptedAnswer(question, answer)) {
      setHasAnswerError(true);
      setFeedback("아쉬워요. 초성에 맞는 두 글자 단어를 다시 입력하세요.");
      return;
    }

    const nextQuestion = pickNextQuestion(
      INITIAL_CONSONANT_QUESTIONS,
      question.initials,
    );
    deadlineRef.current = performance.now() + ROUND_DURATION_MS;
    setQuestion(nextQuestion);
    setAnswer("");
    setScore((currentScore) => currentScore + 1);
    setRemainingMs(ROUND_DURATION_MS);
    setHasAnswerError(false);
    setFeedback("정답입니다! 새 문제가 시작됐어요.");
  };

  const handleAnswerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const nativeKeyboardEvent = event.nativeEvent as globalThis.KeyboardEvent & {
      keyCode?: number;
    };

    if (
      event.key === "Enter" &&
      (event.nativeEvent.isComposing ||
        isComposingRef.current ||
        nativeKeyboardEvent.keyCode === 229)
    ) {
      event.preventDefault();
    }
  };

  const elapsedMs = ROUND_DURATION_MS - remainingMs;
  const elapsedSeconds = elapsedMs / 1_000;
  const progressPercent = (elapsedMs / ROUND_DURATION_MS) * 100;
  const displayedInitials = phase === "READY" ? "??" : question.initials;

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
            <Timer className="size-4" aria-hidden="true" />
            GAME 005 / WORD RUSH
          </p>
          <h1 className="text-4xl font-black leading-none sm:text-6xl">
            초성게임
          </h1>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-muted-foreground sm:text-base">
            두 초성에 맞는 두 글자 단어를 5초 안에 입력하세요. 정답을 맞히면
            즉시 다음 문제와 새 타이머가 시작됩니다.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-md border-2 border-game-ink bg-white shadow-[5px_5px_0_var(--game-ink)] sm:shadow-[8px_8px_0_var(--game-ink)] lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="flex min-h-[450px] flex-col bg-game-acid p-4 sm:min-h-[560px] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span
                className="rounded-full border-2 border-game-ink bg-white px-3 py-1 font-mono text-xs font-black"
                data-testid="initial-consonant-phase"
              >
                {phase}
              </span>
              <p className="rounded-md border-2 border-game-ink bg-game-ink px-4 py-2 text-white">
                점수{" "}
                <strong
                  className="ml-2 text-2xl tabular-nums"
                  data-testid="initial-consonant-score"
                >
                  {score}
                </strong>
              </p>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-end justify-between gap-4 text-sm font-black">
                <span>TIME LIMIT</span>
                <span className="font-mono text-lg tabular-nums">
                  남은 시간 {(remainingMs / 1_000).toFixed(1)}초
                </span>
              </div>
              <div
                className="h-6 overflow-hidden rounded-sm border-2 border-game-ink bg-white"
                role="progressbar"
                aria-label="5초 제한 시간"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={Number(elapsedSeconds.toFixed(2))}
                aria-valuetext={`5초 중 ${elapsedSeconds.toFixed(1)}초 경과`}
              >
                <div
                  className="h-full bg-game-coral transition-[width] duration-75 motion-reduce:transition-none"
                  style={{ width: `${progressPercent}%` }}
                  data-testid="initial-consonant-progress-fill"
                />
              </div>
            </div>

            <div className="my-7 grid flex-1 place-items-center text-center">
              <div>
                <p className="font-mono text-xs font-black tracking-[0.2em]">
                  TWO LETTERS
                </p>
                <p
                  className="mt-3 text-8xl font-black tracking-[0.08em] sm:text-9xl"
                  data-testid="initial-consonant-question"
                  aria-label={
                    phase === "READY"
                      ? "게임 시작 전 초성 가림"
                      : `초성 ${question.initials}`
                  }
                >
                  {displayedInitials}
                </p>
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <label htmlFor="initial-consonant-answer" className="text-sm font-black">
                정답 입력
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  ref={inputRef}
                  id="initial-consonant-answer"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={handleAnswerKeyDown}
                  onCompositionStart={() => {
                    isComposingRef.current = true;
                  }}
                  onCompositionEnd={() => {
                    isComposingRef.current = false;
                  }}
                  disabled={phase !== "PLAYING"}
                  aria-invalid={hasAnswerError}
                  aria-describedby="initial-consonant-feedback"
                  autoComplete="off"
                  maxLength={8}
                  placeholder="예: 가수"
                  className="min-h-14 min-w-0 flex-1 rounded-md border-2 border-game-ink bg-white px-4 text-xl font-black outline-none placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={phase !== "PLAYING"}
                  className="game-pressable flex min-h-14 items-center justify-center gap-2 rounded-md border-2 border-game-ink bg-game-ink px-6 text-lg font-black text-white shadow-[4px_4px_0_var(--game-coral)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
                >
                  <Send className="size-5" aria-hidden="true" />
                  제출
                </button>
              </div>
              <p
                id="initial-consonant-feedback"
                className="min-h-6 text-sm font-bold"
                role="status"
                aria-live="polite"
              >
                {feedback}
              </p>
            </form>
          </section>

          <aside className="border-t-2 border-game-ink bg-white p-6 lg:border-t-0 lg:border-l-2">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-muted-foreground">
              HOW TO PLAY
            </p>
            <h2 className="mt-1 text-2xl font-black">게임 방법</h2>
            <ol className="mt-5 space-y-4 text-sm font-bold leading-6">
              <li className="border-l-4 border-primary pl-3">초성은 항상 두 자리예요.</li>
              <li className="border-l-4 border-game-coral pl-3">초성이 일치하는 두 글자 한글 단어가 정답이에요.</li>
              <li className="border-l-4 border-game-mint pl-3">정답마다 1점, 제한 시간은 다시 5초!</li>
            </ol>
            <button
              type="button"
              onClick={startGame}
              disabled={phase === "PLAYING"}
              className="game-pressable mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-md border-2 border-game-ink bg-primary px-5 text-lg font-black shadow-[5px_5px_0_var(--game-ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-game-coral disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="size-5" aria-hidden="true" />
              {phase === "READY" ? "게임 시작" : "게임 진행 중"}
            </button>
          </aside>
        </div>
      </div>

      <AlertDialog open={phase === "GAME_OVER"}>
        <AlertDialogContent className="border-2 border-game-ink shadow-[7px_7px_0_var(--game-ink)]">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-game-acid text-game-ink">
              <Trophy aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-2xl font-black">
              게임 오버!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              최종 점수는 <strong className="text-2xl text-game-ink">{score}점</strong>입니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={startGame}
              className="border-2 border-game-ink bg-primary font-black text-game-ink"
            >
              다시하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
