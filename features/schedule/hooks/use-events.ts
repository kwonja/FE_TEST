"use client";

import { useCallback, useEffect, useState } from "react";

import type { CalendarEvent, EventInput } from "../model/events";

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? "요청을 처리하지 못했습니다.";
  } catch {
    return "요청을 처리하지 못했습니다.";
  }
}

async function fetchEvents(signal?: AbortSignal) {
  const response = await fetch("/api/events", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as CalendarEvent[];
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async (signal?: AbortSignal) => {
    try {
      setEvents(await fetchEvents(signal));
      setError(null);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "일정을 불러오지 못했습니다.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchEvents(controller.signal)
      .then((eventList) => {
        setEvents(eventList);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "일정을 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadEvents();
  }, [loadEvents]);

  const saveEvent = useCallback(
    async (input: EventInput, id?: number) => {
      const response = await fetch(id ? `/api/events/${id}` : "/api/events", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await refresh();
    },
    [refresh],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await refresh();
    },
    [refresh],
  );

  return {
    events,
    isLoading,
    error,
    refresh,
    saveEvent,
    deleteEvent,
  };
}
