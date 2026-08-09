"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ExternalLink,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  ENQUIRY_BOARD_STATUSES,
  type Enquiry,
  type EnquiryStatus,
  type Property,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useT } from "@/lib/i18n";
import { formatDayTime } from "@/lib/utils";
import { STAFF_ROSTER, staffById } from "@/features/staff";
import {
  useDeleteEnquiry,
  useSetEnquiryNote,
  useSetEnquiryOwner,
} from "../hooks/use-enquiries";

interface EnquiryDetailSheetProps {
  enquiry: Enquiry | null;
  property: Property | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (enquiry: Enquiry, status: EnquiryStatus) => void;
  onEdit: (enquiry: Enquiry) => void;
  onDeleted: () => void;
}

export function EnquiryDetailSheet({
  enquiry,
  property,
  open,
  onOpenChange,
  onStatusChange,
  onEdit,
  onDeleted,
}: EnquiryDetailSheetProps) {
  const { t, text, fill, propertyPrice, locale } = useT();
  const saveNote = useSetEnquiryNote();
  const setOwner = useSetEnquiryOwner();
  const remove = useDeleteEnquiry();

  const [note, setNote] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setNote(enquiry?.note ?? "");
  }, [enquiry]);

  if (!enquiry) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg" />
      </Sheet>
    );
  }

  const owner = staffById(enquiry.assignedTo);

  async function onSaveNote() {
    if (!enquiry) return;
    try {
      await saveNote.mutateAsync({ id: enquiry.id, note });
      toast.success(t.admin.noteSavedToast);
    } catch {
      toast.error(t.admin.moveFailedTitle, {
        description: t.admin.moveFailedBody,
      });
    }
  }

  async function onConfirmDelete() {
    if (!enquiry) return;
    const reference = enquiry.reference;
    try {
      await remove.mutateAsync(enquiry.id);
      setConfirmingDelete(false);
      onDeleted();
      toast.success(fill(t.admin.enquiryDeletedToast, { reference }));
    } catch {
      toast.error(t.admin.moveFailedTitle, {
        description: t.admin.moveFailedBody,
      });
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle dir="auto" className="font-display text-xl">
              {enquiry.customerName}
            </SheetTitle>
            <SheetDescription className="tnum">
              {enquiry.reference} · {t.meta.enquirySource[enquiry.source]} ·{" "}
              {formatDayTime(enquiry.createdAt, locale)}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-7 px-4 pb-8">
            <section className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${enquiry.phone}`} dir="ltr">
                  <Phone data-icon="inline-start" aria-hidden />
                  <span className="tnum">{enquiry.phone}</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://wa.me/966${enquiry.phone.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MessageCircle data-icon="inline-start" aria-hidden />
                  {t.meta.contactPreference.whatsapp}
                </a>
              </Button>
              {enquiry.email ? (
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${enquiry.email}`} dir="ltr">
                    <Mail data-icon="inline-start" aria-hidden />
                    {enquiry.email}
                  </a>
                </Button>
              ) : null}
            </section>

            <section>
              <h3 className="gz-rail">{t.admin.detailMessage}</h3>
              <p
                dir="auto"
                className="mt-2 rounded-md border border-limestone-200 bg-limestone-100/60 p-3.5 text-sm leading-normal text-limestone-800"
              >
                {enquiry.message}
              </p>
            </section>

            <section>
              <h3 className="gz-rail">{t.admin.detailUnit}</h3>
              {property ? (
                <div className="mt-2 rounded-lg border border-limestone-200 bg-card p-4">
                  <p className="font-medium text-petrol-950">
                    {text(property.title)}
                  </p>
                  <p className="tnum mt-1 text-sm text-limestone-600">
                    {property.reference} · {t.meta.district[property.district]} ·{" "}
                    {propertyPrice(property)}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href={`/properties/${property.id}`}>
                      <ExternalLink data-icon="inline-start" aria-hidden />
                      {t.admin.openUnit}
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-limestone-600">
                  {t.admin.detailUnitNone}
                </p>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="gz-rail">{t.admin.colStatus}</h3>
                <Select
                  value={enquiry.status}
                  onValueChange={(value) =>
                    onStatusChange(enquiry, value as EnquiryStatus)
                  }
                >
                  <SelectTrigger className="mt-2 w-full" aria-label={t.admin.colStatus}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_BOARD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t.meta.enquiryStatus[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="gz-rail">{t.admin.detailAssigned}</h3>
                <Select
                  value={enquiry.assignedTo ?? "none"}
                  onValueChange={(value) =>
                    void setOwner.mutateAsync({
                      id: enquiry.id,
                      assignedTo: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger
                    className="mt-2 w-full"
                    aria-label={t.admin.detailAssigned}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t.admin.detailAssignedNone}
                    </SelectItem>
                    {STAFF_ROSTER.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {text(member.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {enquiry.viewingAt ? (
              <section>
                <h3 className="gz-rail">{t.admin.detailViewing}</h3>
                <p className="tnum mt-2 flex items-center gap-2 text-sm text-petrol-800">
                  <CalendarClock aria-hidden className="size-4" />
                  {formatDayTime(enquiry.viewingAt, locale)}
                </p>
              </section>
            ) : null}

            <section>
              <h3 className="gz-rail">{t.admin.detailNote}</h3>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder={t.admin.detailNotePlaceholder}
                aria-label={t.admin.detailNote}
                className="mt-2"
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => void onSaveNote()}
                disabled={saveNote.isPending || note === enquiry.note}
              >
                {t.admin.detailSaveNote}
              </Button>
            </section>

            <section className="flex flex-wrap gap-2 border-t border-limestone-200 pt-5">
              <Button variant="outline" size="sm" onClick={() => onEdit(enquiry)}>
                <Pencil data-icon="inline-start" aria-hidden />
                {t.common.edit}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 data-icon="inline-start" aria-hidden />
                {t.common.delete}
              </Button>
              {owner ? (
                <p className="ms-auto self-center text-xs text-limestone-600">
                  {t.admin.detailAssigned}: {text(owner.name)}
                </p>
              ) : null}
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title={fill(t.admin.deleteEnquiryTitle, { reference: enquiry.reference })}
        description={t.admin.deleteEnquiryBody}
        confirmLabel={t.admin.deleteEnquiryConfirm}
        cancelLabel={t.admin.deletePropertyKeep}
        pending={remove.isPending}
        onConfirm={() => void onConfirmDelete()}
      />
    </>
  );
}
