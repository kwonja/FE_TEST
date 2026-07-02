import {
  ArrowUpRight,
  CircleDot,
  Dices,
  Grid3X3,
  Route,
  Sparkles,
  Ticket,
  Timer,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/shared/ui/badge";

const quickStartGames = [
  {
    title: "사다리",
    icon: Route,
    href: "/games/ladder",
    color: "bg-primary",
  },
  {
    title: "룰렛",
    icon: CircleDot,
    href: undefined,
    color: "bg-game-coral",
  },
  {
    title: "제비뽑기",
    icon: Ticket,
    href: undefined,
    color: "bg-game-acid",
  },
  {
    title: "타이머",
    icon: Timer,
    href: undefined,
    color: "bg-game-mint",
  },
  {
    title: "팀 나누기",
    icon: Grid3X3,
    href: undefined,
    color: "bg-game-sky",
  },
  {
    title: "스코어",
    icon: Trophy,
    href: undefined,
    color: "bg-white",
  },
] as const;

function LadderPreview() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 640 420"
    >
      <rect width="640" height="420" fill="var(--primary)" />
      <rect x="26" y="28" width="124" height="34" fill="var(--game-acid)" />
      <rect x="492" y="354" width="122" height="38" fill="var(--game-coral)" />
      {[112, 250, 388, 526].map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1="86"
          y2="338"
          stroke="var(--game-ink)"
          strokeLinecap="round"
          strokeWidth="10"
        />
      ))}
      {[
        [112, 250, 134],
        [388, 526, 174],
        [250, 388, 226],
        [112, 250, 274],
        [388, 526, 310],
      ].map(([x1, x2, y]) => (
        <line
          key={`${x1}-${y}`}
          x1={x1}
          x2={x2}
          y1={y}
          y2={y}
          stroke="var(--game-ink)"
          strokeLinecap="round"
          strokeWidth="10"
        />
      ))}
      {[
        { fill: "var(--player-1)", cx: 112 },
        { fill: "var(--player-2)", cx: 250 },
        { fill: "var(--player-3)", cx: 388 },
        { fill: "var(--player-4)", cx: 526 },
      ].map(({ fill, cx }) => (
        <circle
          key={`${fill}`}
          cx={cx}
          cy="86"
          r="21"
          fill={fill}
          stroke="var(--game-ink)"
          strokeWidth="7"
        />
      ))}
    </svg>
  );
}

export function GameHub() {
  return (
    <main className="min-h-screen bg-game-paper text-game-ink">
      <header className="border-b-2 border-game-ink bg-game-ink text-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-black"
          >
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Dices className="size-5" aria-hidden="true" />
            </span>
            한판
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs font-bold tracking-[0.18em] text-primary sm:block">
              PLAY WITHOUT A PLAN
            </span>
            <span className="size-3 bg-game-acid" aria-hidden="true" />
          </div>
        </div>
      </header>

      <section
        className="border-b-2 border-game-ink bg-white"
        aria-labelledby="quick-start-title"
      >
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="quick-start-title"
              className="font-mono text-xs font-black tracking-[0.16em]"
            >
              QUICK START
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              게임 바로가기
            </span>
          </div>
          <nav
            className="grid grid-cols-3 gap-2 sm:grid-cols-6"
            aria-label="게임 바로가기"
          >
            {quickStartGames.map((game, index) => {
              const Icon = game.icon;
              const content = (
                <>
                  <span
                    className={`grid size-10 place-items-center rounded-md border border-game-ink ${game.color}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 text-center text-xs font-black">
                    {game.title}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {game.href ? "OPEN" : `SOON ${index + 1}`}
                  </span>
                </>
              );

              return game.href ? (
                <Link
                  key={game.title}
                  href={game.href}
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-game-ink bg-game-paper px-2 transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={game.title}
                  type="button"
                  disabled
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-game-ink/20 bg-muted/40 px-2 text-game-ink opacity-65"
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="border-b-2 border-game-ink bg-primary">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-black">
              <Sparkles className="size-4" aria-hidden="true" />
              오늘의 플레이그라운드
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-none sm:text-6xl">
              고민은 짧게,
              <br />
              게임은 한판.
            </h1>
          </div>
          <div className="flex items-end gap-3 border-l-2 border-game-ink pl-5">
            <strong className="font-mono text-5xl leading-none">01</strong>
            <span className="pb-1 text-xs font-black leading-4">
              PLAYABLE
              <br />
              RIGHT NOW
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-5 flex items-end justify-between border-b-2 border-game-ink pb-3">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.14em]">
              GAME INDEX
            </p>
            <h2 className="mt-1 text-2xl font-black">게임을 골라보세요</h2>
          </div>
          <Badge className="border-2 border-game-ink bg-game-acid text-game-ink">
            계속 추가됩니다
          </Badge>
        </div>

        <Link
          href="/games/ladder"
          className="group grid overflow-hidden rounded-md border-2 border-game-ink bg-white shadow-[8px_8px_0_var(--game-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary lg:grid-cols-[1.25fr_0.75fr]"
        >
          <div className="aspect-[16/10] min-h-0 overflow-hidden border-b-2 border-game-ink lg:border-r-2 lg:border-b-0">
            <LadderPreview />
          </div>
          <div className="flex min-h-64 flex-col justify-between bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm font-black">GAME 001</span>
              <span className="grid size-11 place-items-center rounded-md border-2 border-game-ink bg-game-acid transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="size-6" aria-hidden="true" />
              </span>
            </div>
            <div>
              <Badge className="mb-4 bg-game-coral text-white">3~10명</Badge>
              <h3 className="text-4xl font-black">사다리 타기</h3>
              <p className="mt-3 max-w-sm leading-7 text-muted-foreground">
                이름과 결과를 적고 출발점을 선택하세요. 움직이는 말을 따라
                마지막 칸까지 내려갑니다.
              </p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
