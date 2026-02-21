"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const nextTheme = saved === "dark" ? "dark" : "light";
    root.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
    setMounted(true);
  }, []);

  const onThemeChange = (nextTheme) => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  const toggleTheme = () => {
    onThemeChange(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <button className="theme-icon-btn" aria-label="Toggle theme" onClick={toggleTheme} type="button">
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 17.5A5.5 5.5 0 1 0 12 6.5a5.5 5.5 0 0 0 0 11Zm0 2.5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm0-18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm9 9a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1ZM4 11a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1Zm13.657 6.243a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM5.636 5.636a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 6.343 7.757l-.707-.707a1 1 0 0 1 0-1.414Zm12.728 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM7.05 16.95a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path
            d="M21 13.2A8.8 8.8 0 1 1 10.8 3a7 7 0 1 0 10.2 10.2Z"
          />
          <path d="M15.7 4.4v2.2" />
          <path d="M14.6 5.5h2.2" />
          <path d="M18.9 8v1.6" />
          <path d="M18.1 8.8h1.6" />
        </svg>
      )}
    </button>
  );
}
