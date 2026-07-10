import type { Metadata } from "next";

import { RandomDrawPageClient } from "./random-draw-page-client";

export const metadata: Metadata = {
  title: "1~100 랜덤 뽑기",
  description: "1부터 100까지 숫자 중 하나를 무작위로 뽑아보세요.",
};

const RandomDrawPage = () => {
  return <RandomDrawPageClient />;
};

export default RandomDrawPage;
