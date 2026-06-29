"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CalendarEvent } from "@/lib/events";

import { EventDialog } from "./event-dialog";
import { EventsTable } from "./events-table";
import { useEvents } from "./use-events";

export function TableScreen() {
  const {
    events,
    isLoading,
    error,
    refresh,
    saveEvent,
    deleteEvent,
  } = useEvents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarEvent | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreateDialog() {
    setSelectedEvent(null);
    setDialogOpen(true);
  }

  function openEditDialog(event: CalendarEvent) {
    setSelectedEvent(event);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteEvent(deleteTarget.id);
      setDeleteTarget(null);
    } catch (deleteFailure) {
      setDeleteError(
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "일정을 삭제하지 못했습니다.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-sky-700">Database view</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">일정 테이블</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            등록된 일정을 검색하고 정렬하며 수정 상태를 관리하세요.
          </p>
        </div>
        <Button type="button" size="lg" onClick={openCreateDialog}>
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
        <div className="grid gap-3">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <EventsTable
          events={events}
          onEdit={openEditDialog}
          onDelete={setDeleteTarget}
        />
      )}

      {dialogOpen ? (
        <EventDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          event={selectedEvent}
          onSubmit={saveEvent}
        />
      ) : null}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>일정을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.title}&quot; 일정은 삭제 후 복구할 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
