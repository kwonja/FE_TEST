import type { InitialConsonantQuestion } from "@/features/initial-consonant-game/model/initial-consonant-game";

const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const INITIAL_CONSONANTS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
] as const;
const TWO_HANGUL_SYLLABLES_PATTERN = /^[가-힣]{2}$/u;

export const normalizeAnswer = (value: string) => value.trim().normalize("NFC");

export const extractInitials = (value: string) =>
  Array.from(value.normalize("NFC"), (character) => {
    const codePoint = character.codePointAt(0);

    if (
      codePoint === undefined ||
      codePoint < HANGUL_SYLLABLE_START ||
      codePoint > HANGUL_SYLLABLE_END
    ) {
      return character;
    }

    const initialIndex = Math.floor((codePoint - HANGUL_SYLLABLE_START) / 588);
    return INITIAL_CONSONANTS[initialIndex];
  }).join("");

export const isAcceptedAnswer = (
  question: InitialConsonantQuestion,
  value: string,
) => {
  const normalizedAnswer = normalizeAnswer(value);

  return (
    TWO_HANGUL_SYLLABLES_PATTERN.test(normalizedAnswer) &&
    extractInitials(normalizedAnswer) === question.initials
  );
};

export const pickNextQuestion = (
  questions: readonly InitialConsonantQuestion[],
  currentInitials: string | null = null,
  random: () => number = Math.random,
) => {
  if (questions.length === 0) {
    throw new Error("초성 문제는 한 개 이상이어야 합니다.");
  }

  const candidates = questions.filter(
    (question) => question.initials !== currentInitials,
  );
  const questionPool = candidates.length > 0 ? candidates : questions;
  const randomIndex = Math.min(
    questionPool.length - 1,
    Math.floor(Math.max(0, random()) * questionPool.length),
  );

  return questionPool[randomIndex];
};
