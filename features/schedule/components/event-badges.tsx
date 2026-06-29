import { Badge } from "@/shared/ui/badge";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_STATUS_LABELS,
  type EventCategory,
  type EventStatus,
} from "../model/events";
import { cn } from "@/shared/lib/utils";

const statusStyles: Record<EventStatus, string> = {
  planned: "border-blue-200 bg-blue-50 text-blue-700",
  in_progress: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const categoryStyles: Record<EventCategory, string> = {
  meeting: "border-violet-200 bg-violet-50 text-violet-700",
  work: "border-sky-200 bg-sky-50 text-sky-700",
  personal: "border-rose-200 bg-rose-50 text-rose-700",
  focus: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const calendarCategoryStyles: Record<EventCategory, string> = {
  meeting: "border-violet-200 bg-violet-50 text-violet-800",
  work: "border-sky-200 bg-sky-50 text-sky-800",
  personal: "border-rose-200 bg-rose-50 text-rose-800",
  focus: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-sm", statusStyles[status])}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function EventCategoryBadge({
  category,
}: {
  category: EventCategory;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-sm", categoryStyles[category])}
    >
      {EVENT_CATEGORY_LABELS[category]}
    </Badge>
  );
}

