"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { CalendarEvent } from "../model/events";
import { cn } from "@/shared/lib/utils";

import { calendarCategoryStyles } from "./event-badges";

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

type MonthCalendarProps = {
  events: CalendarEvent[];
  initialMonth?: Date;
  onCreateEvent?: (date: Date) => void;
};

export function MonthCalendar({
  events,
  initialMonth = new Date(),
  onCreateEvent,
}: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);

    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(endOfMonth(monthStart)),
    });
  }, [currentMonth]);

  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();

    for (const event of events) {
      const key = format(parseISO(event.startAt), "yyyy-MM-dd");
      const currentEvents = grouped.get(key) ?? [];
      currentEvents.push(event);
      grouped.set(key, currentEvents);
    }

    return grouped;
  }, [events]);

  return (
    <section
      aria-label="월간 일정"
      className="overflow-hidden rounded-lg border bg-background"
      data-testid="month-calendar"
    >
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <h2 className="text-base font-semibold sm:text-lg">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="이전 달"
            title="이전 달"
            onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            오늘
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="다음 달"
            title="다음 달"
            onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b bg-muted/35">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-xs font-medium text-muted-foreground",
              index === 0 && "text-rose-600",
              index === 6 && "text-blue-600",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents =
            eventsByDay.get(format(day, "yyyy-MM-dd"))?.toSorted((a, b) =>
              a.startAt.localeCompare(b.startAt),
            ) ?? [];
          const visibleEvents = dayEvents.slice(0, 3);
          const hiddenCount = dayEvents.length - visibleEvents.length;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "group min-h-24 border-r border-b p-1.5 last:border-r-0 sm:min-h-32 sm:p-2",
                !isSameMonth(day, currentMonth) && "bg-muted/25",
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs",
                    !isSameMonth(day, currentMonth) &&
                      "text-muted-foreground/55",
                    isSameDay(day, new Date()) &&
                      "bg-foreground font-semibold text-background",
                  )}
                >
                  {format(day, "d")}
                </span>
                {onCreateEvent ? (
                  <button
                    type="button"
                    aria-label={`${format(day, "M월 d일")} 일정 추가`}
                    title="이 날짜에 일정 추가"
                    onClick={() => onCreateEvent(day)}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <div className="grid gap-1">
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    title={event.title}
                    className={cn(
                      "truncate rounded-sm border px-1.5 py-1 text-[11px] font-medium sm:text-xs",
                      calendarCategoryStyles[event.category],
                    )}
                  >
                    <span className="hidden sm:inline">
                      {event.isAllDay
                        ? "종일"
                        : format(parseISO(event.startAt), "HH:mm")}
                      {" · "}
                    </span>
                    {event.title}
                  </div>
                ))}
                {hiddenCount > 0 ? (
                  <span className="px-1 text-[11px] text-muted-foreground">
                    +{hiddenCount}개 더 보기
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

