"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PiStatusBadge } from "./pi-status-badge";
import { PiCodeSnippet } from "./pi-code-snippet";
import { getPiImplementation } from "@/data/pi-implementations";
import { useTranslations, useLocale } from "@/lib/i18n";

interface PiLessonPanelProps {
  version: string;
}

export function PiLessonPanel({ version }: PiLessonPanelProps) {
  const t = useTranslations("pi");
  const locale = useLocale();
  const impl = getPiImplementation(version);

  if (!impl) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        未找到该课程的 pi 实现映射。
      </div>
    );
  }

  const statusKey =
    impl.status === "implemented"
      ? "status_implemented"
      : impl.status === "partial"
        ? "status_partial"
        : impl.status === "not-implemented"
          ? "status_not_implemented"
          : "status_different";

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {impl.tutorialId.toUpperCase()}
          </span>
          <PiStatusBadge status={impl.status} label={t(statusKey)} />
          {impl.keyInsight && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {impl.keyInsight}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
          {impl.summary}
        </p>
        {impl.divergenceNotes && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs leading-5 text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/10 dark:text-amber-200">
            <div className="mb-1 font-semibold uppercase tracking-wide text-[10px] text-amber-700 dark:text-amber-300">
              {t("card_divergence")}
            </div>
            {impl.divergenceNotes}
          </div>
        )}
      </Card>

      {impl.primaryFiles.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("card_files")}
          </div>
          <div className="space-y-4">
            {impl.primaryFiles.map((file) => (
              <div key={file.path}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <code className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {file.path}
                  </code>
                </div>
                <div className="mb-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {file.role}
                </div>
                {file.snippet && <PiCodeSnippet path={file.path} snippet={file.snippet} />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {impl.relatedDemos && impl.relatedDemos.length > 0 && (
        <Card className="p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("card_demos")}
          </div>
          <ul className="space-y-2 text-sm leading-6">
            {impl.relatedDemos.map((d) => (
              <li key={d.name}>
                <span className="font-semibold">{d.name}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  ：{d.description}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href={`/${locale}/pi`}
          className="text-purple-700 underline-offset-2 hover:underline dark:text-purple-300"
        >
          {t("view_full_mapping")}
        </Link>
      </div>
    </div>
  );
}
