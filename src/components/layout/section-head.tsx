import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadProps {
  /** Small label above the heading. */
  rail?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHead({
  rail,
  title,
  lede,
  action,
  className,
  as: Heading = "h2",
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
        className,
      )}
    >
      <div className="max-w-2xl">
        {rail ? (
          <p className="gz-rail flex items-center gap-2">
            {/* A short rule before the label — the drawing-sheet detail. */}
            <span aria-hidden className="inline-block h-px w-6 bg-limestone-400" />
            {rail}
          </p>
        ) : null}
        <Heading
          className={cn(
            "mt-2 text-balance text-petrol-950",
            Heading === "h1" ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl",
          )}
        >
          {title}
        </Heading>
        {lede ? (
          <p className="mt-3 text-pretty text-limestone-700">{lede}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
