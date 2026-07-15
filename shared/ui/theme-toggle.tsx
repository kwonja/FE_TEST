"use client";

import { Moon, Sun } from "lucide-react";

const THEME_STORAGE_KEY = "hanpan-theme";

export const ThemeToggle = () => {
  const toggleTheme = () => {
    const nextTheme = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="테마 전환"
      data-testid="theme-toggle"
      className="game-icon-pressable fixed right-4 bottom-4 z-50 grid size-12 place-items-center rounded-full border-2 border-game-ink bg-game-paper text-game-ink shadow-[4px_4px_0_var(--game-ink)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary sm:right-6 sm:bottom-6"
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="block size-5 dark:hidden" aria-hidden="true" />
    </button>
  );
};
