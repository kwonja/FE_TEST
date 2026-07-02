import type { Metadata } from "next";

import { LadderGame } from "@/features/ladder-game/components/ladder-game";

export const metadata: Metadata = {
  title: "사다리 타기",
  description: "참가자를 선택하고 움직이는 경로를 따라 결과를 확인하세요.",
};

export default function LadderGamePage() {
  return <LadderGame />;
}
