"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PiStatusBadge } from "./pi-status-badge";
import { PiCodeSnippet } from "./pi-code-snippet";
import { useTranslations, useLocale } from "@/lib/i18n";
import { VERSION_META } from "@/lib/constants";
import type { PiImplementation } from "@/data/pi-implementations";

interface PiCapabilityCardProps {
  impl: PiImplementation;
}

export function PiCapabilityCard({ impl }: PiCapabilityCardProps) {
  const t = useTranslations("pi");
  const locale = useLocale();
  const meta = VERSION_META[impl.tutorialId];

  const statusKey =
    impl.status === "implemented"
      ? "status_implemented"
      : impl.status === "partial"
        ? "status_partial"
        : impl.status === "not-implemented"
          ? "status_not_implemented"
          : "status_different";

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {impl.tutorialId.toUpperCase()}
        </span>
        <Link
          href={`/${locale}/${impl.tutorialId}`}
          className="text-base font-semibold transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {meta?.title ?? impl.tutorialId}
        </Link>
        <PiStatusBadge status={impl.status} label={t(statusKey)} />
      </div>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {meta?.subtitle}
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
        {impl.summary}
      </p>

      {impl.keyInsight && (
        <blockquote className="mt-3 border-l-4 border-zinc-300 pl-3 text-xs italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
          {impl.keyInsight}
        </blockquote>
      )}

      {impl.divergenceNotes && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs leading-5 text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/10 dark:text-amber-200">
          <div className="mb-1 font-semibold uppercase tracking-wide text-[10px] text-amber-700 dark:text-amber-300">
            {t("card_divergence")}
          </div>
          {impl.divergenceNotes}
        </div>
      )}

      {impl.primaryFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("card_files")}
          </div>
          <div className="space-y-3">
            {impl.primaryFiles.map((file) => (
              <div key={file.path}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <code className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                    {file.path}
                  </code>
                </div>
                <div className="mb-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {file.role}
                </div>
                {file.snippet && <PiCodeSnippet path={file.path} snippet={file.snippet} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
