import { describe, expect, it } from "vitest";

import {
  INITIAL_CONSONANT_QUESTIONS,
  type InitialConsonantQuestion,
} from "@/features/initial-consonant-game/model/initial-consonant-game";
import {
  extractInitials,
  isAcceptedAnswer,
  normalizeAnswer,
  pickNextQuestion,
} from "@/features/initial-consonant-game/utils/initial-consonant-game";

describe("초성게임 유틸", () => {
  it("완성형 한글에서 초성을 추출한다", () => {
    expect(extractInitials("가수")).toBe("ㄱㅅ");
    expect(extractInitials("꽃병")).toBe("ㄲㅂ");
  });

  it("문제 데이터가 20개 이상이며 모든 정답이 두 글자 초성과 일치한다", () => {
    expect(INITIAL_CONSONANT_QUESTIONS.length).toBeGreaterThanOrEqual(20);

    for (const question of INITIAL_CONSONANT_QUESTIONS) {
      expect(question.initials).toHaveLength(2);
      expect(question.acceptedAnswers.length).toBeGreaterThan(0);

      for (const answer of question.acceptedAnswers) {
        expect(answer).toMatch(/^[가-힣]{2}$/u);
        expect(extractInitials(answer)).toBe(question.initials);
      }
    }
  });

  it("입력값을 trim 및 NFC 정규화하고 초성이 일치하는 두 글자 한글을 허용한다", () => {
    const question = INITIAL_CONSONANT_QUESTIONS[0];
    const decomposedAnswer = "가수".normalize("NFD");

    expect(normalizeAnswer(`  ${decomposedAnswer}  `)).toBe("가수");
    expect(isAcceptedAnswer(question, ` ${decomposedAnswer} `)).toBe(true);
    expect(isAcceptedAnswer(question, "가슴")).toBe(true);
  });

  it("초성 불일치, 한 글자, 세 글자, 영문 입력을 거부한다", () => {
    const question = INITIAL_CONSONANT_QUESTIONS[0];

    expect(isAcceptedAnswer(question, "나무")).toBe(false);
    expect(isAcceptedAnswer(question, "강")).toBe(false);
    expect(isAcceptedAnswer(question, "가수님")).toBe(false);
    expect(isAcceptedAnswer(question, "GS")).toBe(false);
  });

  it("주입한 난수로 직전 초성과 다른 다음 문제를 고른다", () => {
    const questions: readonly InitialConsonantQuestion[] = [
      { initials: "ㄱㅅ", acceptedAnswers: ["가수"] },
      { initials: "ㄴㅁ", acceptedAnswers: ["나무"] },
      { initials: "ㅂㄷ", acceptedAnswers: ["바다"] },
    ];

    expect(pickNextQuestion(questions, "ㄱㅅ", () => 0).initials).toBe("ㄴㅁ");
    expect(pickNextQuestion(questions, "ㄱㅅ", () => 0.999).initials).toBe(
      "ㅂㄷ",
    );
  });
});
