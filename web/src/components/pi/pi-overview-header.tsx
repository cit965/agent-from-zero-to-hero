import { Card } from "@/components/ui/card";
import { getPiStats } from "@/data/pi-implementations";
import { useTranslations } from "@/lib/i18n";

interface PiOverviewHeaderProps {
  total: number;
}

export function PiOverviewHeader({ total }: PiOverviewHeaderProps) {
  const t = useTranslations("pi");
  const stats = getPiStats();

  const items = [
    {
      key: "implemented" as const,
      label: t("stat_implemented"),
      value: stats.implemented,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "partial" as const,
      label: t("stat_partial"),
      value: stats.partial,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      key: "missing" as const,
      label: t("stat_missing"),
      value: stats.notImplemented + stats.differentParadigm,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-300">
          {t("hero_badge")}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("hero_title")}
        </h1>
        <p className="text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
          {t("hero_subtitle")}
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className={`text-3xl font-bold ${item.color}`}>
                {item.value}
                <span className="ml-1 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                  / {total}
                </span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
