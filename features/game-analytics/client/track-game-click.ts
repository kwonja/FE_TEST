"use client";

import { httpClient } from "@/shared/api/http-client";
import { isOnline } from "@/shared/api/network";

import type { GameClickEventInput } from "../model/game-click-event";

const GAME_CLICK_API_PATH = "/analytics/game-click";
const GAME_CLICK_ENDPOINT = `/api${GAME_CLICK_API_PATH}`;

export const trackGameClick = (event: GameClickEventInput) => {
  if (!isOnline()) {
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

  void httpClient
    .post(GAME_CLICK_API_PATH, payload, {
      adapter: "fetch",
      headers: {
        "Content-Type": "application/json",
      },
      fetchOptions: {
        keepalive: true,
      },
    })
    .catch(() => undefined);
};
