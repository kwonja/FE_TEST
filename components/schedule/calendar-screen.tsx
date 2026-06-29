"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { EventDialog } from "./event-dialog";
import { MonthCalendar } from "./month-calendar";
import { useEvents } from "./use-events";

export function CalendarScreen() {
  const { events, isLoading, error, refresh, saveEvent } = useEvents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | null>(null);

  function openCreateDialog(date?: Date) {
    setInitialDate(date ?? new Date());
    setDialogOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-700">
            Schedule workspace
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl">일정 캘린더</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            월간 흐름을 살펴보고 필요한 날짜에 일정을 추가하세요.
          </p>
        </div>
        <Button type="button" size="lg" onClick={() => openCreateDialog()}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          일정 추가
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-4 rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <span>{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={refresh}>
            다시 시도
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="overflow-hidden rounded-lg border">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="grid grid-cols-7 gap-px bg-border">
            {Array.from({ length: 35 }, (_, index) => (
              <Skeleton
                key={index}
                className="h-24 rounded-none bg-background sm:h-32"
              />
            ))}
          </div>
        </div>
      ) : (
        <MonthCalendar events={events} onCreateEvent={openCreateDialog} />
      )}

      {dialogOpen ? (
        <EventDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialDate={initialDate}
          onSubmit={saveEvent}
        />
      ) : null}
    </div>
  );
}
