import { cn } from "@/lib/utils";
import type { PiStatus } from "@/data/pi-implementations";

const STATUS_STYLES: Record<PiStatus, string> = {
  implemented:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  partial:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "not-implemented":
    "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "different-paradigm":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

interface PiStatusBadgeProps {
  status: PiStatus;
  label: string;
  className?: string;
}

export function PiStatusBadge({ status, label, className }: PiStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {label}
    </span>
  );
}
