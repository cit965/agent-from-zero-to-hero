import Link from "next/link";
import { notFound } from "next/navigation";
import { TravelLessonDetail } from "@/components/travel/travel-lesson-detail";
import { getTravelLessonScreenshots } from "@/data/travel-assistant-assets";
import { getTravelAssistantLessonScenario } from "@/data/travel-assistant-scenarios";
import { getTravelLessonSourceFiles } from "@/data/travel-assistant-source";
import {
  getTravelLesson,
  getTravelLessonDisplayTitle,
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
  const sourceFiles = await getTravelLessonSourceFiles(currentLesson.id);
  const screenshots = getTravelLessonScreenshots(currentLesson.id);

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-4">
      <div className="max-w-3xl">
        <header className="space-y-3">
          <Link
            href={`/${locale}/travel-assistant`}
            className="inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            ← 返回教程总览
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {currentLesson.label}
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {currentLesson.title}
            </h1>
          </div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {travelAssistantTutorial.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{travelAssistantTutorial.title}</span>
            <span>{travelAssistantTutorial.stats[1]}</span>
            <span>{travelAssistantTutorial.stats[3]}</span>
          </div>
          <blockquote className="border-l-4 border-zinc-300 pl-4 text-sm italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
            这一课会把旅行助手往完整产品再推进一步，同时保留可运行、可验证的最小实现。
          </blockquote>
        </header>
      </div>

      <TravelLessonDetail
        markdown={currentLesson.markdown}
        scenario={lessonScenario}
        sourceFiles={sourceFiles}
        screenshots={screenshots}
      />

      <div className="max-w-3xl">
        <nav className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
          {prevLesson ? (
            <Link
              href={`/${locale}${getTravelLessonHref(prevLesson.id)}`}
              className="group flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                &larr;
              </span>
              <div>
                <div className="text-xs text-zinc-400">上一课</div>
                <div className="font-medium">
                  {getTravelLessonDisplayTitle(prevLesson)}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/${locale}${getTravelLessonHref(nextLesson.id)}`}
              className="group flex items-center gap-2 text-right text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <div>
                <div className="text-xs text-zinc-400">下一课</div>
                <div className="font-medium">
                  {getTravelLessonDisplayTitle(nextLesson)}
                </div>
              </div>
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ) : (
            <Link
              href={`/${locale}/travel-assistant`}
              className="group flex items-center gap-2 text-right text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              <div>
                <div className="text-xs text-zinc-400">完成课程</div>
                <div className="font-medium">返回教程总览</div>
              </div>
              <span className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
