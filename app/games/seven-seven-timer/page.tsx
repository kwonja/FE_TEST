import type { Metadata } from "next";

import { SevenSevenTimerGame } from "@/features/seven-seven-timer/components/seven-seven-timer-game";

export const metadata: Metadata = {
  title: "3.33 맞추기",
  description: "3.33초에 최대한 가깝게 타이머를 멈춰 보세요.",
};

const SevenSevenTimerPage = () => <SevenSevenTimerGame />;

export default SevenSevenTimerPage;
