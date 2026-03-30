"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "@/lib/i18n";
import { VERSION_META } from "@/lib/constants";
import { Github, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "travel", href: "/travel-assistant" },
  { key: "timeline", href: "/s01" },
  { key: "compare", href: "/compare" },
] as const;

const GITHUB_REPO_URL = "https://github.com/cit965/agent-from-zero-to-hero";
const CLAUDE_VERSION_IDS = Object.keys(VERSION_META);

function isClaudeCodeRoute(pathname: string, locale: string) {
  return CLAUDE_VERSION_IDS.some((versionId) =>
    pathname === `/${locale}/${versionId}` ||
    pathname.startsWith(`/${locale}/${versionId}/`)
  );
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="text-lg font-bold">
          Agent 从小白到架构师
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === "timeline"
              ? isClaudeCodeRoute(pathname, locale)
              : pathname === `/${locale}${item.href}` ||
                pathname.startsWith(`/${locale}${item.href}/`);

            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-white",
                  isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <button
            onClick={toggleDark}
            className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener"
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
          >
            <Github size={18} />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="flex min-h-[44px] items-center text-sm"
              onClick={() => setMobileOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
