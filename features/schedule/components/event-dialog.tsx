"use client";

import { useState, type FormEvent } from "react";
import { addHours, format, parseISO, setHours, setMinutes } from "date-fns";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_LABELS,
  EVENT_STATUSES,
  EVENT_STATUS_LABELS,
  type CalendarEvent,
  type EventCategory,
  type EventInput,
  type EventStatus,
} from "../model/events";

type EventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  initialDate?: Date | null;
  onSubmit: (input: EventInput, id?: number) => Promise<void>;
};

type EventFormState = {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  status: EventStatus;
  category: EventCategory;
  location: string;
  isAllDay: boolean;
};

function toLocalDateTime(value: Date) {
  return format(value, "yyyy-MM-dd'T'HH:mm");
}

function getInitialForm(
  event?: CalendarEvent | null,
  initialDate?: Date | null,
): EventFormState {
  if (event) {
    return {
      title: event.title,
      description: event.description ?? "",
      startAt: toLocalDateTime(parseISO(event.startAt)),
      endAt: toLocalDateTime(parseISO(event.endAt)),
      status: event.status,
      category: event.category,
      location: event.location ?? "",
      isAllDay: event.isAllDay,
    };
  }

  const baseDate = initialDate ?? new Date();
  const startAt = setMinutes(setHours(baseDate, 9), 0);

  return {
    title: "",
    description: "",
    startAt: toLocalDateTime(startAt),
    endAt: toLocalDateTime(addHours(startAt, 1)),
    status: "planned",
    category: "work",
    location: "",
    isAllDay: false,
  };
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  initialDate,
  onSubmit,
}: EventDialogProps) {
  const [form, setForm] = useState<EventFormState>(() =>
    getInitialForm(event, initialDate),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateForm<Key extends keyof EventFormState>(
    key: Key,
    value: EventFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();

    const startAt = new Date(form.startAt);
    const endAt = new Date(form.endAt);

    if (endAt <= startAt) {
      setError("종료 시각은 시작 시각보다 늦어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(
        {
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        },
        event?.id,
      );
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "일정을 저장하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{event ? "일정 수정" : "새 일정"}</DialogTitle>
            <DialogDescription>
              캘린더와 테이블에 함께 표시될 일정을 입력하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-title">제목</Label>
              <Input
                id="event-title"
                data-testid="event-title-input"
                value={form.title}
                onChange={(inputEvent) =>
                  updateForm("title", inputEvent.target.value)
                }
                placeholder="예: 주간 프로젝트 회의"
                maxLength={120}
                required
                autoFocus
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-start">시작</Label>
                <Input
                  id="event-start"
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(inputEvent) =>
                    updateForm("startAt", inputEvent.target.value)
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-end">종료</Label>
                <Input
                  id="event-end"
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(inputEvent) =>
                    updateForm("endAt", inputEvent.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-category">카테고리</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    value && updateForm("category", value as EventCategory)
                  }
                >
                  <SelectTrigger id="event-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {EVENT_CATEGORY_LABELS[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="event-status">상태</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    value && updateForm("status", value as EventStatus)
                  }
                >
                  <SelectTrigger id="event-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {EVENT_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-location">장소</Label>
              <Input
                id="event-location"
                value={form.location}
                onChange={(inputEvent) =>
                  updateForm("location", inputEvent.target.value)
                }
                placeholder="예: 4층 회의실 또는 온라인"
                maxLength={200}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-description">설명</Label>
              <Textarea
                id="event-description"
                value={form.description}
                onChange={(inputEvent) =>
                  updateForm("description", inputEvent.target.value)
                }
                placeholder="일정에 필요한 메모를 남겨 주세요."
                maxLength={1000}
              />
            </div>

            <Label
              htmlFor="event-all-day"
              className="w-fit cursor-pointer font-normal"
            >
              <input
                id="event-all-day"
                type="checkbox"
                checked={form.isAllDay}
                onChange={(inputEvent) =>
                  updateForm("isAllDay", inputEvent.target.checked)
                }
                className="size-4 rounded border-input accent-emerald-600"
              />
              종일 일정
            </Label>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              data-testid="event-save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
