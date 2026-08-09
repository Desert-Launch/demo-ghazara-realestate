import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  /** One line that says what to do next, never an apology. */
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "gz-sheet flex flex-col items-center justify-center rounded-lg border border-dashed border-limestone-300 bg-limestone-100/50 px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-limestone-500">{icon}</div> : null}
      <p className="font-display text-lg font-semibold text-petrol-900">
        {title}
      </p>
      <p className="mt-1.5 max-w-sm text-sm text-limestone-700">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
