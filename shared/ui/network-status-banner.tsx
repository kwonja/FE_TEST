"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribeToNetworkStatus = (onStoreChange: () => void) => {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
};

const getNetworkStatus = () => navigator.onLine;
const getServerNetworkStatus = () => true;

export const NetworkStatusBanner = () => {
  const isOnline = useSyncExternalStore(
    subscribeToNetworkStatus,
    getNetworkStatus,
    getServerNetworkStatus,
  );

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="network-status-banner"
      className="sticky top-0 z-[60] flex min-h-11 items-center justify-center gap-2 border-b-2 border-game-ink bg-game-coral px-4 py-2 text-center text-sm font-black text-[var(--game-contrast-ink)]"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden="true" />
      <p>오프라인으로 플레이 중입니다. 통계는 기록되지 않습니다.</p>
    </div>
  );
};
