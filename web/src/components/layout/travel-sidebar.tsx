"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  getTravelLessonHref,
  travelAssistantTutorial,
} from "@/data/travel-assistant-tutorial";

export function TravelSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const overviewHref = `/${locale}/travel-assistant`;

  return (
    <nav className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-[calc(3.5rem+2rem)] space-y-5">
        <div>
          <div className="flex items-center gap-1.5 pb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              LangChain 应用路线
            </span>
          </div>
          <ul className="space-y-0.5">
            <li>
              <Link
                href={overviewHref}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  pathname === overviewHref || pathname === `${overviewHref}/`
                    ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                )}
              >
                教程总览
              </Link>
            </li>
            {travelAssistantTutorial.sections.map((section) => {
              const href = `/${locale}${getTravelLessonHref(section.id)}`;
              const isActive = pathname === href || pathname === `${href}/`;

              return (
                <li key={section.id}>
                  <Link
                    href={href}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                    )}
                  >
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                      {section.label}
                    </span>
                    <span className="ml-1.5">{section.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
