"use client";

import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SourceViewer } from "@/components/code/source-viewer";
import { cn } from "@/lib/utils";
import type { TravelLessonSourceFile } from "@/data/travel-assistant-source";

interface TravelSourcePanelProps {
  files: TravelLessonSourceFile[];
}

export function TravelSourcePanel({ files }: TravelSourcePanelProps) {
  const [activeFileId, setActiveFileId] = useState(files[0]?.id ?? "");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const activeFile =
    files.find((file) => file.id === activeFileId) ?? files[0] ?? null;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!activeFile) {
    return (
      <div className="text-sm text-[var(--color-text-secondary)]">
        当前课时还没有可展示的源码文件。
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4 lg:flex-row">
      <motion.aside
        initial={false}
        animate={
          isDesktop
            ? { width: isCollapsed ? 72 : 240 }
            : { width: "100%" }
        }
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 lg:shrink-0"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-900">
          <AnimatePresence initial={false} mode="popLayout">
            {(!isDesktop || !isCollapsed) && (
              <motion.div
                key="title"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-sm font-semibold"
              >
                文件目录
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed((value) => !value)}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:inline-flex"
            aria-label={isCollapsed ? "展开文件目录" : "折叠文件目录"}
            title={isCollapsed ? "展开文件目录" : "折叠文件目录"}
          >
            <motion.span
              key={isCollapsed ? "open" : "close"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </motion.span>
          </button>
        </div>
        <div className="p-2">
          {files.map((file) => (
            <motion.button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              whileHover={{ x: isDesktop && !isCollapsed ? 2 : 0 }}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors",
                file.id === activeFile.id
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
              )}
              title={file.relativePath}
            >
              <AnimatePresence initial={false} mode="wait">
                {isDesktop && isCollapsed ? (
                  <motion.span
                    key="collapsed"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono text-[11px]"
                  >
                    {file.label}
                  </motion.span>
                ) : (
                  <motion.span
                    key="expanded"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.16 }}
                    className="font-mono text-xs"
                  >
                    {file.relativePath}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.aside>

      <motion.div
        layout
        className="min-w-0 flex-1"
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <SourceViewer
          source={activeFile.source}
          filename={activeFile.relativePath}
        />
      </motion.div>
    </section>
  );
}
