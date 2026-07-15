"use client";

import type { GameClickEventInput } from "../model/game-click-event";

const GAME_CLICK_ENDPOINT = "/api/analytics/game-click";

export const trackGameClick = (event: GameClickEventInput) => {
  if (!navigator.onLine) {
    return;
  }

  const payload = JSON.stringify({
    ...event,
    clickedAt: event.clickedAt ?? new Date().toISOString(),
  });

  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], {
      type: "application/json",
    });

    if (navigator.sendBeacon(GAME_CLICK_ENDPOINT, blob)) {
      return;
    }
  }

  void fetch(GAME_CLICK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
};
