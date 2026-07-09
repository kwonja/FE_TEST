"use client";

import type { GameClickEventInput } from "../model/game-click-event";

const GAME_CLICK_ENDPOINT = "/api/analytics/game-click";

export const trackGameClick = (event: GameClickEventInput) => {
  const payload = JSON.stringify({
    ...event,
    clickedAt: event.clickedAt ?? new Date().toISOString(),
  });

  if ("sendBeacon" in navigator) {
    const blob = new Blob([payload], {
      type: "application/json",
    });

    navigator.sendBeacon(GAME_CLICK_ENDPOINT, blob);
    return;
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
