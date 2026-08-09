"use client";

import { ArrowLeft, CalendarClock, GripVertical, MapPin } from "lucide-react";

import type { Enquiry, EnquiryStatus, Property } from "@/types";
import { useT } from "@/lib/i18n";
import { cn, formatAgo, formatDayTime } from "@/lib/utils";
import { staffById } from "@/features/staff";
import { ENQUIRY_STATUS_META, nextEnquiryStatus } from "../status";

interface EnquiryCardProps {
  enquiry: Enquiry;
  /** The unit this lead came from, if it is still listed. */
  property: Property | undefined;
  dragging: boolean;
  onOpen: (enquiry: Enquiry) => void;
  onAdvance: (enquiry: Enquiry, status: EnquiryStatus) => void;
  onDragStart: (enquiry: Enquiry) => void;
  onDragEnd: () => void;
}

export function EnquiryCard({
  enquiry,
  property,
  dragging,
  onOpen,
  onAdvance,
  onDragStart,
  onDragEnd,
}: EnquiryCardProps) {
  const { t, text, fill, locale } = useT();
  const meta = ENQUIRY_STATUS_META[enquiry.status];
  const next = nextEnquiryStatus(enquiry.status);
  const owner = staffById(enquiry.assignedTo);

  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", enquiry.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart(enquiry);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group rounded-lg border-s-2 border-limestone-200 bg-card shadow-sm transition-shadow",
        meta.columnClass,
        dragging ? "opacity-50" : "hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-1 p-3">
        <GripVertical
          aria-hidden
          className="mt-0.5 size-4 shrink-0 cursor-grab text-limestone-400 opacity-0 transition-opacity group-hover:opacity-100"
        />

        <button
          type="button"
          onClick={() => onOpen(enquiry)}
          className="min-w-0 flex-1 text-start"
        >
          <span className="flex items-baseline justify-between gap-2">
            {/* Customer names and messages arrive in either script, so each
                gets its own base direction — otherwise an English name inside
                the Arabic layout truncates from the wrong end. */}
            <span dir="auto" className="truncate font-medium text-petrol-950">
              {enquiry.customerName}
            </span>
            <span className="tnum shrink-0 text-2xs text-limestone-500">
              {enquiry.reference}
            </span>
          </span>

          <span
            dir="auto"
            className="mt-1.5 line-clamp-2 block text-xs leading-snug text-limestone-700"
          >
            {enquiry.message}
          </span>

          {property ? (
            <span className="mt-2.5 flex items-center gap-1.5 text-2xs text-limestone-600">
              <MapPin aria-hidden className="size-3 shrink-0" />
              <span className="truncate">{text(property.title)}</span>
            </span>
          ) : (
            <span className="mt-2.5 block text-2xs text-limestone-500">
              {t.admin.detailUnitNone}
            </span>
          )}

          {enquiry.viewingAt ? (
            <span className="tnum mt-2 flex items-center gap-1.5 text-2xs text-petrol-700">
              <CalendarClock aria-hidden className="size-3 shrink-0" />
              {formatDayTime(enquiry.viewingAt, locale)}
            </span>
          ) : null}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-limestone-200 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2 text-2xs text-limestone-500">
          <span className={cn("size-1.5 shrink-0 rounded-full", meta.dotClass)} aria-hidden />
          <span className="whitespace-nowrap">
            {formatAgo(enquiry.createdAt, locale)}
          </span>
          {owner ? (
            <span className="truncate text-limestone-600">· {text(owner.name)}</span>
          ) : null}
        </span>

        {next ? (
          <button
            type="button"
            onClick={() => onAdvance(enquiry, next)}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-2xs font-medium text-petrol-700 transition-colors hover:bg-petrol-50"
          >
            {fill(t.admin.advanceTo, { status: t.meta.enquiryStatus[next] })}
            <ArrowLeft aria-hidden className="size-3 ltr:-scale-x-100" />
          </button>
        ) : null}
      </div>
    </li>
  );
}
