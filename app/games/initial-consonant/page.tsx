import type { Metadata } from "next";

import { InitialConsonantGame } from "@/features/initial-consonant-game/components/initial-consonant-game";

export const metadata: Metadata = {
  title: "초성게임",
  description: "두 자리 초성에 맞는 단어를 5초 안에 맞혀 보세요.",
};

const InitialConsonantGamePage = () => <InitialConsonantGame />;

export default InitialConsonantGamePage;
