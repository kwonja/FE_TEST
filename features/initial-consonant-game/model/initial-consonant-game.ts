export type InitialConsonantGamePhase = "READY" | "PLAYING" | "GAME_OVER";

export type InitialConsonantQuestion = {
  initials: string;
  acceptedAnswers: readonly string[];
};

export const ROUND_DURATION_MS = 5_000;
export const TIMER_TICK_INTERVAL_MS = 50;

export const INITIAL_CONSONANT_QUESTIONS: readonly InitialConsonantQuestion[] = [
  { initials: "ㄱㅅ", acceptedAnswers: ["가수", "감사", "교실", "국수"] },
  { initials: "ㄱㅂ", acceptedAnswers: ["가방", "공부", "김밥"] },
  { initials: "ㄱㅊ", acceptedAnswers: ["기차", "고추"] },
  { initials: "ㄴㅁ", acceptedAnswers: ["나무", "눈물"] },
  { initials: "ㄴㄹ", acceptedAnswers: ["노래", "나라"] },
  { initials: "ㄷㅈ", acceptedAnswers: ["돼지", "도전"] },
  { initials: "ㄹㅂ", acceptedAnswers: ["리본", "로봇"] },
  { initials: "ㅁㄹ", acceptedAnswers: ["머리", "미로"] },
  { initials: "ㅁㅈ", acceptedAnswers: ["모자", "먼지"] },
  { initials: "ㅂㄷ", acceptedAnswers: ["바다", "바닥"] },
  { initials: "ㅂㅈ", acceptedAnswers: ["바지", "반지"] },
  { initials: "ㅅㄱ", acceptedAnswers: ["사과", "시간", "소금", "수건"] },
  { initials: "ㅅㅈ", acceptedAnswers: ["사진", "시장"] },
  { initials: "ㅇㄱ", acceptedAnswers: ["야구", "안경"] },
  { initials: "ㅇㅈ", acceptedAnswers: ["의자", "우주"] },
  { initials: "ㅈㄷ", acceptedAnswers: ["지도", "장독"] },
  { initials: "ㅈㅁ", acceptedAnswers: ["장미", "주먹"] },
  { initials: "ㅊㄱ", acceptedAnswers: ["친구", "축구"] },
  { initials: "ㅋㅍ", acceptedAnswers: ["커피", "쿠폰"] },
  { initials: "ㅌㄲ", acceptedAnswers: ["토끼"] },
  { initials: "ㅍㄷ", acceptedAnswers: ["포도", "파도"] },
  { initials: "ㅎㄱ", acceptedAnswers: ["학교", "한글", "항구"] },
  { initials: "ㅎㅈ", acceptedAnswers: ["휴지", "호주"] },
  { initials: "ㄲㅂ", acceptedAnswers: ["꽃병", "꿀벌"] },
  { initials: "ㅅㅂ", acceptedAnswers: ["신발", "선배"] },
] as const;
