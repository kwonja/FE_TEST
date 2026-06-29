import { ScheduleSidebar } from "@/components/schedule/schedule-sidebar";

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/20 lg:flex">
      <ScheduleSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

