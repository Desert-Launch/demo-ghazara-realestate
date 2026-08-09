"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  ENQUIRY_BOARD_STATUSES,
  type Enquiry,
  type EnquiryStatus,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useProperties } from "@/features/properties";
import { useAdvanceEnquiryStatus, useEnquiries } from "../hooks/use-enquiries";
import { ENQUIRY_STATUS_META } from "../status";
import { EnquiryCard } from "./enquiry-card";
import { EnquiryDetailSheet } from "./enquiry-detail-sheet";
import { EnquiryFormDialog } from "./enquiry-form-dialog";

/**
 * The lead board — the half of the pitch that says "nothing gets lost".
 *
 * Moves are optimistic so a drag lands instantly. `advanceEnquiryStatus` drops
 * one move in ten on purpose; when it does, the card returns to its column and
 * the toast says what happened and what to do.
 */
export function EnquiryBoard() {
  const { t, fill, number } = useT();
  const { data, isPending, isError, refetch } = useEnquiries();
  const { data: properties } = useProperties();
  const advance = useAdvanceEnquiryStatus();
  const reduceMotion = useReducedMotion();

  const [dragging, setDragging] = useState<Enquiry | null>(null);
  const [dropTarget, setDropTarget] = useState<EnquiryStatus | null>(null);
  const [detail, setDetail] = useState<Enquiry | null>(null);
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const propertyById = useMemo(
    () => new Map((properties ?? []).map((property) => [property.id, property])),
    [properties],
  );

  // Keep an open drawer in step with the list after a mutation lands.
  useEffect(() => {
    if (!detail || !data) return;
    const fresh = data.find((enquiry) => enquiry.id === detail.id);
    if (fresh && fresh !== detail) setDetail(fresh);
  }, [data, detail]);

  async function moveTo(enquiry: Enquiry, status: EnquiryStatus) {
    if (enquiry.status === status) return;

    try {
      await advance.mutateAsync({ id: enquiry.id, status });
      toast.success(
        fill(t.admin.movedToast, {
          reference: enquiry.reference,
          status: t.meta.enquiryStatus[status],
        }),
      );
    } catch {
      toast.error(t.admin.moveFailedTitle, {
        description: t.admin.moveFailedBody,
      });
    }
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title={t.properties.errorTitle}
        description={t.properties.errorBody}
        action={<Button onClick={() => void refetch()}>{t.common.retry}</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-limestone-600">{t.admin.boardHint}</p>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus data-icon="inline-start" aria-hidden />
          {t.admin.addEnquiry}
        </Button>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
        <div className="grid min-w-[68rem] grid-cols-5 gap-4">
          {ENQUIRY_BOARD_STATUSES.map((status) => {
            const meta = ENQUIRY_STATUS_META[status];
            const column = (data ?? []).filter(
              (enquiry) => enquiry.status === status,
            );
            const isTarget = dropTarget === status && dragging?.status !== status;

            return (
              <section
                key={status}
                aria-labelledby={`column-${status}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTarget(status);
                }}
                onDragLeave={() =>
                  setDropTarget((current) => (current === status ? null : current))
                }
                onDrop={(event) => {
                  event.preventDefault();
                  setDropTarget(null);
                  const id = event.dataTransfer.getData("text/plain");
                  const enquiry = (data ?? []).find((entry) => entry.id === id);
                  if (enquiry) void moveTo(enquiry, status);
                }}
                className={cn(
                  "rounded-lg border bg-limestone-100/70 p-3 transition-colors",
                  isTarget
                    ? "border-petrol-500 bg-petrol-50"
                    : "border-limestone-200",
                )}
              >
                <div className="flex items-center justify-between gap-2 px-1 pb-3">
                  <h2
                    id={`column-${status}`}
                    className="flex items-center gap-2 text-sm font-semibold text-petrol-900"
                  >
                    <span
                      aria-hidden
                      className={cn("inline-block size-2 rounded-full", meta.dotClass)}
                    />
                    {t.meta.enquiryStatus[status]}
                  </h2>
                  <span className="tnum text-xs text-limestone-600">
                    {isPending ? "—" : number(column.length)}
                  </span>
                </div>

                {isPending ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }, (_, index) => (
                      <Skeleton key={index} className="h-32 rounded-lg" />
                    ))}
                  </div>
                ) : column.length === 0 ? (
                  <p className="rounded-md border border-dashed border-limestone-300 px-3 py-8 text-center text-xs text-limestone-600">
                    {t.admin[meta.emptyKey]}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {column.map((enquiry) => (
                        <motion.div
                          key={enquiry.id}
                          layout={!reduceMotion}
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={
                            reduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.97 }
                          }
                          transition={{ duration: 0.18 }}
                        >
                          <EnquiryCard
                            enquiry={enquiry}
                            property={
                              enquiry.propertyId
                                ? propertyById.get(enquiry.propertyId)
                                : undefined
                            }
                            dragging={dragging?.id === enquiry.id}
                            onOpen={setDetail}
                            onAdvance={(target, next) => void moveTo(target, next)}
                            onDragStart={setDragging}
                            onDragEnd={() => {
                              setDragging(null);
                              setDropTarget(null);
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <EnquiryDetailSheet
        enquiry={detail}
        property={
          detail?.propertyId ? propertyById.get(detail.propertyId) : undefined
        }
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        onStatusChange={(enquiry, status) => void moveTo(enquiry, status)}
        onEdit={(enquiry) => {
          setEditing(enquiry);
          setFormOpen(true);
        }}
        onDeleted={() => setDetail(null)}
      />

      <EnquiryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        enquiry={editing}
      />
    </div>
  );
}
