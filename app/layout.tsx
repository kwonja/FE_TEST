import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import Script from "next/script";
import { cn } from "@/shared/lib/utils";
import { NetworkStatusBanner } from "@/shared/ui/network-status-banner";
import { ServiceWorkerRegister } from "@/shared/ui/service-worker-register";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

const themeScript = `(() => {
  try {
    const storedTheme = localStorage.getItem("hanpan-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", storedTheme ? storedTheme === "dark" : prefersDark);
  } catch {}
})();`;

export const metadata: Metadata = {
  title: {
    default: "한판",
    template: "%s | 한판",
  },
  description: "가볍게 모여 함께 즐기는 웹 게임 모음",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <NetworkStatusBanner />
        {children}
        <ServiceWorkerRegister />
        <ThemeToggle />
        <Script id="theme-initializer" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </body>
    </html>
  );
}
