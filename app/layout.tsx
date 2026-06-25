import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator Test Lab",
  description: "A small calculator app for testing Vitest, RTL, and Playwright.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
