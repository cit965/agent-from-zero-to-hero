"use client";

import { useState } from "react";
import { PiCodeSnippet as PiCodeSnippetType } from "@/data/pi-implementations";

interface PiCodeSnippetProps {
  path: string;
  snippet: PiCodeSnippetType;
}

export function PiCodeSnippet({ path, snippet }: PiCodeSnippetProps) {
  const [expanded, setExpanded] = useState(false);
  const lines = snippet.code.split("\n");

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
      >
        <span className="font-mono text-zinc-500 dark:text-zinc-400">
          {snippet.caption || path}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">
          {expanded ? "▾" : "▸"}
        </span>
      </button>
      {expanded && (
        <div className="overflow-x-auto bg-zinc-950">
          <pre className="p-3 text-[10px] leading-4 sm:text-xs sm:leading-5">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-2 inline-block w-6 shrink-0 select-none text-right text-zinc-600 sm:mr-4 sm:w-8">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre text-zinc-200">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
