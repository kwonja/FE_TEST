export type RandomSource = () => number;

export function drawRandomNumber(
  min: number,
  max: number,
  random: RandomSource = Math.random,
) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new RangeError("유효한 정수 범위를 입력해야 합니다.");
  }

  return Math.floor(random() * (max - min + 1)) + min;
}
