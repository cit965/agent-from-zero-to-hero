"use client";

import { DocRenderer } from "@/components/docs/doc-renderer";
import { SourceViewer } from "@/components/code/source-viewer";
import { AgentLoopSimulator } from "@/components/simulator/agent-loop-simulator";
import { Tabs } from "@/components/ui/tabs";
import { PiLessonPanel } from "@/components/pi/pi-lesson-panel";
import { useTranslations } from "@/lib/i18n";

interface VersionDetailClientProps {
  version: string;
  diff: {
    from: string;
    to: string;
    newClasses: string[];
    newFunctions: string[];
    newTools: string[];
    locDelta: number;
  } | null;
  source: string;
  filename: string;
}

export function VersionDetailClient({
  version,
  diff,
  source,
  filename,
}: VersionDetailClientProps) {
  const t = useTranslations("version");
  const tPi = useTranslations("pi");

  const tabs = [
    { id: "learn", label: t("tab_learn") },
    { id: "simulate", label: t("tab_simulate") },
    { id: "code", label: t("tab_code") },
    { id: "pi", label: tPi("tab_pi") },
  ];
  void diff;

  return (
    <div className="space-y-6">
      {/* Tabbed content */}
      <Tabs tabs={tabs} defaultTab="learn">
        {(activeTab) => (
          <>
            {activeTab === "learn" && <DocRenderer version={version} />}
            {activeTab === "simulate" && (
              <AgentLoopSimulator version={version} />
            )}
            {activeTab === "code" && (
              <SourceViewer source={source} filename={filename} />
            )}
            {activeTab === "pi" && <PiLessonPanel version={version} />}
          </>
        )}
      </Tabs>
    </div>
  );
}
