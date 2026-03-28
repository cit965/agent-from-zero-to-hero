"use client";

import { useEffect, useRef } from "react";
import { useSimulator } from "@/hooks/useSimulator";
import { SimulatorControls } from "@/components/simulator/simulator-controls";
import { SimulatorMessage } from "@/components/simulator/simulator-message";
import type { Scenario } from "@/types/agent-data";

interface TravelAgentSimulatorProps {
  scenario: Scenario;
}

export function TravelAgentSimulator({ scenario }: TravelAgentSimulatorProps) {
  const sim = useSimulator(scenario.steps);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [sim.visibleSteps.length]);

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900/80 dark:bg-cyan-950/40 dark:text-cyan-300">
          可播放示例
        </div>
        <h2 className="text-xl font-semibold">{scenario.title}</h2>
        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
          {scenario.description}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
        <div className="border-b border-[var(--color-border)] bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
          <SimulatorControls
            isPlaying={sim.isPlaying}
            isComplete={sim.isComplete}
            currentIndex={sim.currentIndex}
            totalSteps={sim.totalSteps}
            speed={sim.speed}
            onPlay={sim.play}
            onPause={sim.pause}
            onStep={sim.stepForward}
            onReset={sim.reset}
            onSpeedChange={sim.setSpeed}
          />
        </div>

        <div
          ref={scrollRef}
          className="flex max-h-[460px] min-h-[220px] flex-col gap-3 overflow-y-auto p-4"
        >
          {sim.visibleSteps.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-secondary)]">
              点击“播放”或“单步”查看 Agent 如何逐步完成旅行规划。
            </div>
          )}

          {sim.visibleSteps.map((step, index) => (
            <SimulatorMessage key={`${step.type}-${index}`} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
