import type { Metadata } from "next";

import { ReactionSpeedGame } from "@/features/reaction-speed/components/reaction-speed-game";

export const metadata: Metadata = {
  title: "반응속도 게임",
  description: "신호가 뜨는 순간 눌러 반응속도를 ms 단위로 확인하세요.",
};

const ReactionSpeedPage = () => <ReactionSpeedGame />;

export default ReactionSpeedPage;
