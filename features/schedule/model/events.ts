export const EVENT_STATUSES = [
  "planned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export const EVENT_CATEGORIES = [
  "meeting",
  "work",
  "personal",
  "focus",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type CalendarEvent = {
  id: number;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  status: EventStatus;
  category: EventCategory;
  location: string | null;
  isAllDay: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventInput = {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  status: EventStatus;
  category: EventCategory;
  location: string;
  isAllDay: boolean;
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  planned: "예정",
  in_progress: "진행 중",
  completed: "완료",
  cancelled: "취소",
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  meeting: "미팅",
  work: "업무",
  personal: "개인",
  focus: "집중",
};

