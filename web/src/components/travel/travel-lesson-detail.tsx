"use client";

import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { MarkdownArticle } from "@/components/docs/markdown-article";
import { TravelAgentSimulator } from "@/components/travel/travel-agent-simulator";
import { TravelScreenshotGallery } from "@/components/travel/travel-screenshot-gallery";
import type { Scenario } from "@/types/agent-data";
import { TravelSourcePanel } from "@/components/travel/travel-source-panel";
import type { TravelLessonSourceFile } from "@/data/travel-assistant-source";
import type { TravelLessonScreenshot } from "@/data/travel-assistant-assets";

interface TravelLessonDetailProps {
  markdown: string;
  scenario: Scenario | null;
  sourceFiles: TravelLessonSourceFile[];
  screenshots: TravelLessonScreenshot[];
}

export function TravelLessonDetail({
  markdown,
  scenario,
  sourceFiles,
  screenshots,
}: TravelLessonDetailProps) {
  if (!scenario && sourceFiles.length === 0) {
    return (
      <Card className="p-6 sm:p-8">
        <MarkdownArticle content={markdown} />
      </Card>
    );
  }

  const tabs = [
    { id: "learn", label: "学习" },
    ...(scenario ? [{ id: "simulate", label: "模拟" }] : []),
    ...(sourceFiles.length ? [{ id: "code", label: "源码" }] : []),
  ];

  return (
    <Tabs tabs={tabs} defaultTab="learn">
      {(activeTab) =>
        activeTab === "learn" ? (
          <div className="max-w-3xl">
            <Card className="p-6 sm:p-8">
              <TravelScreenshotGallery screenshots={screenshots} />
              <MarkdownArticle content={markdown} />
            </Card>
          </div>
        ) : activeTab === "simulate" && scenario ? (
          <div className="max-w-3xl">
            <Card className="p-6 sm:p-8">
              <TravelAgentSimulator scenario={scenario} />
            </Card>
          </div>
        ) : (
          <Card className="p-6 sm:p-8">
            <TravelSourcePanel files={sourceFiles} />
          </Card>
        )
      }
    </Tabs>
  );
}
