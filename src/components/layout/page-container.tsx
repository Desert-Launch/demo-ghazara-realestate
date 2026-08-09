import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** `wide` drops the reading-width cap for grids and boards. */
  width?: "default" | "wide" | "narrow";
}

export function PageContainer({
  children,
  className,
  width = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        width === "default" && "max-w-[var(--container-page)]",
        width === "wide" && "max-w-[96rem]",
        width === "narrow" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
