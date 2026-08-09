"use client";

import type { PropertyStatus, TransactionType } from "@/types";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PROPERTY_STATUS_META } from "../taxonomy";

export function StatusBadge({
  status,
  className,
}: {
  status: PropertyStatus;
  className?: string;
}) {
  const { t } = useT();
  const meta = PROPERTY_STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.badgeClass,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {t.meta.status[status]}
    </span>
  );
}

/**
 * Sale and rent are the first thing a buyer filters on, so the pill is solid
 * rather than outlined and sits in the same corner on every card.
 */
export function TransactionPill({
  transaction,
  className,
}: {
  transaction: TransactionType;
  className?: string;
}) {
  const { t } = useT();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        transaction === "sale"
          ? "bg-petrol-700 text-limestone-50"
          : "bg-limestone-900 text-limestone-50",
        className,
      )}
    >
      {t.meta.transaction[transaction]}
    </span>
  );
}
