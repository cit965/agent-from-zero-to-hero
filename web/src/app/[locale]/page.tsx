"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";
import { LEARNING_PATH } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { travelAssistantTutorial } from "@/data/travel-assistant-tutorial";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  const seriesCards = [
    {
      href: `/${locale}/s01`,
      dotClass: "bg-blue-500",
      borderClass: "border-blue-500/30 hover:border-blue-500/60",
      label: t("course_claude_label"),
      meta: `${LEARNING_PATH.length}${t("course_claude_meta")}`,
      title: t("course_claude_title"),
      desc: t("course_claude_desc"),
    },
    {
      href: `/${locale}/travel-assistant`,
      dotClass: "bg-emerald-500",
      borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
      label: t("course_travel_label"),
      meta: `${travelAssistantTutorial.sections.length}${t("course_travel_meta")}`,
      title: t("course_travel_title"),
      desc: t("course_travel_desc"),
    },
  ];

  const siteNotes = [
    { title: t("site_note_1_title"), desc: t("site_note_1_desc") },
    { title: t("site_note_2_title"), desc: t("site_note_2_desc") },
    { title: t("site_note_3_title"), desc: t("site_note_3_desc") },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-14 pb-16">
      <section className="pt-8 sm:pt-16">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            {t("hero_badge")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-xl">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/s01`}
              className="inline-flex min-h-[44px] items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t("claude_cta")}
            </Link>
            <Link
              href={`/${locale}/travel-assistant`}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              {t("travel_cta")}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("featured_tutorials")}
          </h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            {t("featured_tutorials_desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {seriesCards.map((card) => (
            <Link key={card.href} href={card.href} className="group block">
              <Card className={`h-full transition-all duration-200 ${card.borderClass}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${card.dotClass}`} />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
                      {card.label}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {card.meta}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold group-hover:underline">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {card.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Card className="p-6 sm:p-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{t("site_notes_title")}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
              {t("site_notes_desc")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {siteNotes.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-4"
              >
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
