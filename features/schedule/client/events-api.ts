"use client";

import axios from "axios";

import { httpClient } from "@/shared/api/http-client";
import { isOfflineError } from "@/shared/api/http-error";
import { assertOnline } from "@/shared/api/network";

import type { CalendarEvent, EventInput } from "../model/events";

type ErrorResponse = {
  message?: unknown;
};

const normalizeEventError = (error: unknown, fallbackMessage: string) => {
  if (axios.isCancel(error) || isOfflineError(error)) {
    return error;
  }

  if (axios.isAxiosError<ErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.length > 0) {
      return new Error(message);
    }
  }

  return new Error(fallbackMessage);
};

export const isEventRequestCanceled = (error: unknown) =>
  axios.isCancel(error);

export const getEvents = async (signal?: AbortSignal) => {
  try {
    assertOnline("오프라인에서는 일정을 불러올 수 없습니다.");

    const response = await httpClient.get<CalendarEvent[]>("/events", {
      signal,
    });

    return response.data;
  } catch (error) {
    throw normalizeEventError(error, "일정을 불러오지 못했습니다.");
  }
};

export const createEvent = async (input: EventInput) => {
  try {
    assertOnline("오프라인에서는 일정을 저장할 수 없습니다.");

    const response = await httpClient.post<CalendarEvent>("/events", input);

    return response.data;
  } catch (error) {
    throw normalizeEventError(error, "일정을 저장하지 못했습니다.");
  }
};

export const updateEvent = async (id: number, input: EventInput) => {
  try {
    assertOnline("오프라인에서는 일정을 저장할 수 없습니다.");

    const response = await httpClient.patch<CalendarEvent>(
      `/events/${id}`,
      input,
    );

    return response.data;
  } catch (error) {
    throw normalizeEventError(error, "일정을 저장하지 못했습니다.");
  }
};

export const deleteEvent = async (id: number) => {
  try {
    assertOnline("오프라인에서는 일정을 삭제할 수 없습니다.");

    const response = await httpClient.delete<void>(`/events/${id}`);

    return response.data;
  } catch (error) {
    throw normalizeEventError(error, "일정을 삭제하지 못했습니다.");
  }
};
