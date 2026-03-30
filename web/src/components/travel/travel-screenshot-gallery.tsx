"use client";

import type { TravelLessonScreenshot } from "@/data/travel-assistant-assets";

interface TravelScreenshotGalleryProps {
  screenshots: TravelLessonScreenshot[];
}

export function TravelScreenshotGallery({
  screenshots,
}: TravelScreenshotGalleryProps) {
  if (screenshots.length === 0) return null;

  return (
    <section className="mb-8 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">运行效果</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          第五课会把前面几课的能力真正组装成一个可交互的 Web 应用，下面是运行后的界面效果。
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {screenshots.map((item) => (
          <figure
            key={item.src}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full object-cover"
            />
            <figcaption className="space-y-1 p-4">
              <div className="text-sm font-semibold">{item.title}</div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {item.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
