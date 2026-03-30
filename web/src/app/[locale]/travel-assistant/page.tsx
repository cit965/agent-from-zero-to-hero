import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  getTravelLessonDisplayTitle,
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
    <div className="mx-auto max-w-3xl space-y-10 py-4">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            教程总览
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">{tutorial.title}</h1>
        </div>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          {tutorial.subtitle}
        </p>
        <p className="max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
          {tutorial.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tutorial.stats.map((item) => (
            <span
              key={item}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
        <div>
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
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold">教程定位</div>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            面向想做 Agent 产品的开发者，用旅行规划这个典型场景把工具调用、记忆和 Web 应用串起来。
          </p>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold">你会做出来什么</div>
          <ul className="mt-2 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li>一个能查天气、查景点、估算交通的 Agent</li>
            <li>一个支持多轮记忆的旅行对话助手</li>
            <li>一个基于 Flask 的 Web 交互界面</li>
          </ul>
        </Card>
      </section>

      <section id="outline" className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">课程目录</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            结构和 Claude Code 路线保持一致，按课时顺序推进即可。
          </p>
        </div>
        <div className="grid gap-3">
          {tutorial.sections.map((section) => (
            <Link
              key={section.id}
              href={`/${locale}${getTravelLessonHref(section.id)}`}
              className="group block"
            >
              <Card className="p-5 transition-colors group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                <div className="text-sm font-semibold">
                  {getTravelLessonDisplayTitle(section)}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
