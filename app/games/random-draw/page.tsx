import type { Metadata } from "next";

import { RandomDrawGame } from "@/features/random-draw/components/random-draw-game";

export const metadata: Metadata = {
  title: "1~100 랜덤 뽑기",
  description: "1부터 100까지 숫자 중 하나를 무작위로 뽑아보세요.",
};

export default function RandomDrawPage() {
  return <RandomDrawGame />;
}
