"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { httpClient } from "@/shared/api/http-client";
import { isOfflineError } from "@/shared/api/http-error";

import type { CalendarEvent, EventInput } from "../model/events";

type ErrorResponse = {
  message?: unknown;
};

const getScheduleErrorMessage = (
  error: unknown,
  fallbackMessage: string,
  offlineMessage: string,
) => {
  if (isOfflineError(error)) {
    return offlineMessage;
  }

  if (axios.isAxiosError<ErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallbackMessage;
};

const fetchEvents = async (signal?: AbortSignal) => {
  const response = await httpClient.get<CalendarEvent[]>("/events", {
    signal,
  });

  return response.data;
};

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async (signal?: AbortSignal) => {
    try {
      setEvents(await fetchEvents(signal));
      setError(null);
    } catch (loadError) {
      if (axios.isCancel(loadError)) {
        return;
      }

      setError(
        getScheduleErrorMessage(
          loadError,
          "일정을 불러오지 못했습니다.",
          "오프라인에서는 일정을 불러올 수 없습니다.",
        ),
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
        if (axios.isCancel(loadError)) {
          return;
        }

        setError(
          getScheduleErrorMessage(
            loadError,
            "일정을 불러오지 못했습니다.",
            "오프라인에서는 일정을 불러올 수 없습니다.",
          ),
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
      try {
        if (id) {
          await httpClient.patch(`/events/${id}`, input);
        } else {
          await httpClient.post("/events", input);
        }
      } catch (saveError) {
        if (axios.isCancel(saveError)) {
          throw saveError;
        }

        throw new Error(
          getScheduleErrorMessage(
            saveError,
            "일정을 저장하지 못했습니다.",
            "오프라인에서는 일정을 저장할 수 없습니다.",
          ),
        );
      }

      await refresh();
    },
    [refresh],
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      try {
        await httpClient.delete(`/events/${id}`);
      } catch (deleteError) {
        if (axios.isCancel(deleteError)) {
          throw deleteError;
        }

        throw new Error(
          getScheduleErrorMessage(
            deleteError,
            "일정을 삭제하지 못했습니다.",
            "오프라인에서는 일정을 삭제할 수 없습니다.",
          ),
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
