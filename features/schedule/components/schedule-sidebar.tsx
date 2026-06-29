"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, TableProperties } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const navigation = [
  {
    href: "/calendar",
    label: "캘린더",
    icon: CalendarDays,
  },
  {
    href: "/table",
    label: "테이블",
    icon: TableProperties,
  },
] as const;

function NavigationLinks() {
  const pathname = usePathname();

  return navigation.map((item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
        {item.label}
      </Link>
    );
  });
}

export function ScheduleSidebar() {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar px-4 py-6 lg:flex">
        <Link
          href="/calendar"
          className="mb-8 flex items-center gap-3 px-2 text-sidebar-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold">Dayline</span>
            <span className="block text-xs text-sidebar-foreground/55">
              일정 관리
            </span>
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="grid gap-1">
          <NavigationLinks />
        </nav>

        <div className="mt-auto border-t pt-4 text-xs leading-5 text-sidebar-foreground/50">
          Supabase와 Drizzle로
          <br />
          일정을 동기화합니다.
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/calendar" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-md bg-emerald-600 text-white">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            Dayline
          </Link>
          <nav aria-label="주요 메뉴" className="flex gap-1">
            <NavigationLinks />
          </nav>
        </div>
      </header>
    </>
  );
}

