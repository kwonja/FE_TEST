export type RandomSource = () => number;

export const getRandomWaitDuration = (
  min: number,
  max: number,
  random: RandomSource = Math.random,
) => {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new RangeError("유효한 대기 시간 범위를 입력해야 합니다.");
  }

  return Math.floor(random() * (max - min + 1)) + min;
};

export const formatReactionTime = (milliseconds: number) =>
  `${Math.round(milliseconds)}ms`;
