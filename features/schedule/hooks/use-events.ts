"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createEvent,
  deleteEvent as requestDeleteEvent,
  getEvents,
  isEventRequestCanceled,
  updateEvent,
} from "../client/events-api";
import type { CalendarEvent, EventInput } from "../model/events";

const getErrorMessage = (error: unknown, fallbackMessage: string) =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : fallbackMessage;

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async (signal?: AbortSignal) => {
    try {
      setEvents(await getEvents(signal));
      setError(null);
    } catch (loadError) {
      if (isEventRequestCanceled(loadError)) {
        return;
      }

      setError(getErrorMessage(loadError, "일정을 불러오지 못했습니다."));
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => loadEvents(controller.signal));

    return () => controller.abort();
  }, [loadEvents]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadEvents();
  }, [loadEvents]);

  const saveEvent = useCallback(
    async (input: EventInput, id?: number) => {
      try {
        if (id !== undefined) {
          await updateEvent(id, input);
        } else {
          await createEvent(input);
        }
      } catch (saveError) {
        if (isEventRequestCanceled(saveError)) {
          throw saveError;
        }

        throw new Error(
          getErrorMessage(saveError, "일정을 저장하지 못했습니다."),
        );
      }

      await refresh();
    },
    [refresh],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      try {
        await requestDeleteEvent(id);
      } catch (deleteError) {
        if (isEventRequestCanceled(deleteError)) {
          throw deleteError;
        }

        throw new Error(
          getErrorMessage(deleteError, "일정을 삭제하지 못했습니다."),
        );
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
};
