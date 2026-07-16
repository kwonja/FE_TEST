export class OfflineError extends Error {
  constructor() {
    super("네트워크 연결을 사용할 수 없습니다.");
    this.name = "OfflineError";
  }
}

export const isOfflineError = (error: unknown): error is OfflineError =>
  error instanceof OfflineError;
