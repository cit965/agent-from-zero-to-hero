import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MarkdownArticle } from "@/components/docs/markdown-article";
import { TravelAgentSimulator } from "@/components/travel/travel-agent-simulator";
import { getTravelAssistantLessonScenario } from "@/data/travel-assistant-scenarios";
import {
  getTravelLesson,
  getTravelLessonHref,
  travelAssistantLessons,
  travelAssistantTutorial,
} from "@/data/travel-assistant-tutorial";

export function generateStaticParams() {
  return travelAssistantLessons.map((lesson) => ({ lesson: lesson.id }));
}

export default async function TravelAssistantLessonPage({
  params,
}: {
  params: Promise<{ locale: string; lesson: string }>;
}) {
  const { locale, lesson } = await params;
  const currentLesson = getTravelLesson(lesson);

  if (!currentLesson) {
    notFound();
  }

  const lessonIndex = travelAssistantLessons.findIndex((item) => item.id === lesson);
  const prevLesson = lessonIndex > 0 ? travelAssistantLessons[lessonIndex - 1] : null;
  const nextLesson =
    lessonIndex < travelAssistantLessons.length - 1
      ? travelAssistantLessons[lessonIndex + 1]
      : null;
  const lessonScenario = getTravelAssistantLessonScenario(currentLesson.id);

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <section className="space-y-5">
        <Link
          href={`/${locale}/travel-assistant`}
          className="inline-flex items-center text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          ← 返回教程总览
        </Link>

        <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300">
          {currentLesson.label}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {currentLesson.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
            {travelAssistantTutorial.subtitle}
          </p>
        </div>
      </section>

      {lessonScenario && (
        <Card className="p-6 sm:p-8">
          <TravelAgentSimulator scenario={lessonScenario} />
        </Card>
      )}

      <Card className="p-6 sm:p-8">
        <MarkdownArticle content={currentLesson.markdown} />
      </Card>

      <nav className="grid gap-4 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2">
        {prevLesson ? (
          <Link
            href={`/${locale}${getTravelLessonHref(prevLesson.id)}`}
            className="rounded-xl border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <div className="text-xs text-[var(--color-text-secondary)]">上一课</div>
            <div className="mt-1 font-semibold">
              {prevLesson.label} · {prevLesson.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/${locale}${getTravelLessonHref(nextLesson.id)}`}
            className="rounded-xl border border-[var(--color-border)] p-4 text-right transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <div className="text-xs text-[var(--color-text-secondary)]">下一课</div>
            <div className="mt-1 font-semibold">
              {nextLesson.label} · {nextLesson.title}
            </div>
          </Link>
        ) : (
          <Link
            href={`/${locale}/travel-assistant`}
            className="rounded-xl border border-[var(--color-border)] p-4 text-right transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <div className="text-xs text-[var(--color-text-secondary)]">完成课程</div>
            <div className="mt-1 font-semibold">返回教程总览</div>
          </Link>
        )}
      </nav>
    </div>
  );
}
