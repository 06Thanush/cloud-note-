"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-purple-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-800/80 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl border border-purple-200/60 dark:border-zinc-700 bg-purple-50/70 hover:bg-purple-100/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer shadow-xs"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
