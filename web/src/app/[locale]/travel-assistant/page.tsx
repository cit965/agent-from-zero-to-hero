import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MarkdownArticle } from "@/components/docs/markdown-article";
import {
  getTravelLessonHref,
  travelAssistantTutorial,
} from "@/data/travel-assistant-tutorial";

export default async function TravelAssistantTutorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tutorial = travelAssistantTutorial;

  return (
    <div className="max-w-4xl space-y-10 pb-12">
      <section className="space-y-6">
        <div className="inline-flex flex-wrap gap-2">
          {tutorial.stats.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              {item}
            </span>
          ))}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {tutorial.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
            {tutorial.subtitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
            {tutorial.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}${getTravelLessonHref("lesson-1")}`}
            className="inline-flex min-h-[44px] items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            开始学习
          </Link>
          <Link
            href="#outline"
            className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            查看大纲
          </Link>
        </div>

        <Card className="border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:border-emerald-900/70 dark:from-emerald-950/30 dark:to-cyan-950/20">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                教程定位
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                面向想做 Agent 产品的开发者，用旅行规划这个典型场景把工具调用、记忆和 Web 应用串起来。
              </p>
            </div>
            <div className="rounded-xl border border-white/70 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="text-sm font-semibold">你会做出来什么</div>
              <ul className="mt-2 space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li>一个能查天气、查景点、估算交通的 Agent</li>
                <li>一个支持多轮记忆的旅行对话助手</li>
                <li>一个基于 Flask 的 Web 交互界面</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section id="outline" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tutorial.sections.map((section) => (
          <Link
            key={section.id}
            href={`/${locale}${getTravelLessonHref(section.id)}`}
            className="group block"
          >
            <Card className="h-full border-[var(--color-border)] p-5 transition-colors group-hover:border-emerald-400/70">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                {section.label}
              </div>
              <div className="mt-2 text-sm font-semibold leading-6">
                {section.title}
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <Card className="min-w-0 p-6 sm:p-8">
        <MarkdownArticle content={tutorial.markdown} />
      </Card>
    </div>
  );
}
