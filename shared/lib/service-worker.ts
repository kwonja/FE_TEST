const SERVICE_WORKER_URL = "/sw.js";

export const registerServiceWorker = async () => {
  if (
    process.env.NODE_ENV !== "production" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
      scope: "/",
      updateViaCache: "none",
    });
  } catch {
    // 오프라인 캐시는 점진적 향상이므로 등록 실패가 게임 실행을 막지 않도록 한다.
  }
};
