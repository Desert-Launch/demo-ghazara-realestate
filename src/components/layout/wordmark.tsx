"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** Inverted sits on the petrol chrome; default sits on limestone. */
  tone?: "default" | "inverted";
  showTagline?: boolean;
}

/**
 * The agency's mark: the calligraphic "د" (for ديمو) in an off-white counter on a petrol
 * tile, with the name set beside it. Drawn as type inside a rounded tile rather
 * than an image, so it stays crisp at every size and inherits the palette.
 */
export function Wordmark({
  className,
  tone = "default",
  showTagline = false,
}: WordmarkProps) {
  const { t } = useT();

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-md text-xl leading-none",
          tone === "inverted"
            ? "bg-limestone-50 text-petrol-800"
            : "bg-petrol-700 text-limestone-50",
        )}
        style={{ fontFamily: "var(--gz-family-display)", paddingBottom: "2px" }}
      >
        د
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-tight",
            tone === "inverted" ? "text-limestone-50" : "text-petrol-900",
          )}
        >
          {t.brand.name}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-xs",
              tone === "inverted" ? "text-petrol-200" : "text-limestone-600",
            )}
          >
            {t.brand.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
