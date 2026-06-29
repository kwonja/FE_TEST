"use client";

import { useMemo, useState } from "react";
import {
  type Column,
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_STATUS_LABELS,
  type CalendarEvent,
} from "../model/events";

import { EventCategoryBadge, EventStatusBadge } from "./event-badges";

type EventsTableProps = {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
};

function SortableHeader({
  column,
  label,
}: {
  column: Column<CalendarEvent, unknown>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown aria-hidden="true" />
    </Button>
  );
}

function formatEventTime(event: CalendarEvent) {
  if (event.isAllDay) {
    return `${format(parseISO(event.startAt), "yyyy. MM. dd")} 종일`;
  }

  return format(parseISO(event.startAt), "yyyy. MM. dd HH:mm");
}

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startAt", desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<CalendarEvent>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <SortableHeader column={column} label="일정" />
        ),
        cell: ({ row }) => (
          <div className="min-w-52">
            <p className="font-medium">{row.original.title}</p>
            <p className="mt-0.5 max-w-72 truncate text-xs text-muted-foreground">
              {row.original.description || "설명 없음"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "startAt",
        header: ({ column }) => (
          <SortableHeader column={column} label="시작" />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{formatEventTime(row.original)}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "카테고리",
        cell: ({ row }) => (
          <EventCategoryBadge category={row.original.category} />
        ),
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => <EventStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "location",
        header: "장소",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.location || "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">행 작업</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`${row.original.title} 수정`}
              title="일정 수정"
              onClick={() => onEdit(row.original)}
            >
              <Pencil aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`${row.original.title} 삭제`}
              title="일정 삭제"
              className="text-destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onEdit],
  );

  // TanStack Table exposes mutable callbacks that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: events,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const event = row.original;
      const searchableText = [
        event.title,
        event.description,
        event.location,
        EVENT_CATEGORY_LABELS[event.category],
        EVENT_STATUS_LABELS[event.status],
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko");

      return searchableText.includes(String(filterValue).toLocaleLowerCase("ko"));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <section aria-label="일정 데이터 테이블">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            data-testid="event-search-input"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-8"
            placeholder="일정, 장소, 상태 검색"
            aria-label="일정 검색"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          총 {table.getFilteredRowModel().rows.length}개 일정
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-testid="event-table-row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-muted-foreground"
                >
                  조건에 맞는 일정이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} /{" "}
          {Math.max(table.getPageCount(), 1)} 페이지
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="이전 페이지"
            title="이전 페이지"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="다음 페이지"
            title="다음 페이지"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
