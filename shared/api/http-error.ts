export class OfflineError extends Error {
  constructor(message = "네트워크 연결을 사용할 수 없습니다.") {
    super(message);
    this.name = "OfflineError";
  }
}

export const isOfflineError = (error: unknown): error is OfflineError =>
  error instanceof OfflineError;
