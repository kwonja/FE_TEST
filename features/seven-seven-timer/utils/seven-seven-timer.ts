import { SEVEN_SEVEN_TARGET_SECONDS } from "@/features/seven-seven-timer/model/seven-seven-timer";

export const formatTimerSeconds = (seconds: number) => `${seconds.toFixed(2)}s`;

export const getTimerDifference = (seconds: number) =>
  Math.abs(seconds - SEVEN_SEVEN_TARGET_SECONDS);

export const getTimerResultMessage = (seconds: number) => {
  const difference = getTimerDifference(seconds);

  if (difference < 0.01) {
    return "완벽합니다. 7.77초를 정확히 맞췄어요.";
  }

  if (difference < 0.1) {
    return "거의 다 왔어요. 손끝 감각이 좋네요.";
  }

  if (seconds < SEVEN_SEVEN_TARGET_SECONDS) {
    return "조금 일렀어요. 다음에는 한 박자만 더 기다려 보세요.";
  }

  return "조금 늦었어요. 다음에는 한 박자만 더 빠르게 눌러 보세요.";
};
