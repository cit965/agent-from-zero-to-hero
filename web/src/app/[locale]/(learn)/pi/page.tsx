"use client";

import { piImplementations } from "@/data/pi-implementations";
import { LEARNING_PATH } from "@/lib/constants";
import { useTranslations } from "@/lib/i18n";
import { PiOverviewHeader } from "@/components/pi/pi-overview-header";
import { PiCapabilityCard } from "@/components/pi/pi-capability-card";

export default function PiOverviewPage() {
  const t = useTranslations("pi");
  void t;

  // Order by LEARNING_PATH (s01 → s12) so cards mirror the lesson flow.
  const ordered = LEARNING_PATH.map(
    (id) => piImplementations.find((p) => p.tutorialId === id)!
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16">
      <PiOverviewHeader total={LEARNING_PATH.length} />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">12 课 × pi 实现对照</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            按课程顺序浏览每一课在 pi 代码库中的对应实现：已实现 / 部分实现 / 未实现 / 不同范式。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ordered.map((impl) => (
            <PiCapabilityCard key={impl.tutorialId} impl={impl} />
          ))}
        </div>
      </section>
    </div>
  );
}
