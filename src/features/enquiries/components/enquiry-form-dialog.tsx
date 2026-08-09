"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  CONTACT_PREFERENCES,
  ENQUIRY_SOURCES,
  ENQUIRY_STATUSES,
  type Enquiry,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { useT } from "@/lib/i18n";
import { useProperties } from "@/features/properties";
import { STAFF_ROSTER } from "@/features/staff";
import { toAdminEnquiryFormValues, toAdminEnquiryInput } from "../api";
import { useCreateEnquiry, useUpdateEnquiry } from "../hooks/use-enquiries";
import {
  ADMIN_ENQUIRY_DEFAULTS,
  makeAdminEnquirySchema,
  type AdminEnquiryFormValues,
} from "../schema";

interface EnquiryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null opens the dialog for a walk-in or phone lead. */
  enquiry: Enquiry | null;
}

/** "" is not a legal Radix Select value, so an unset option needs a sentinel. */
const NONE = "none";

export function EnquiryFormDialog({
  open,
  onOpenChange,
  enquiry,
}: EnquiryFormDialogProps) {
  const { t, text, fill } = useT();
  const { data: properties } = useProperties();
  const create = useCreateEnquiry();
  const update = useUpdateEnquiry();
  const schema = useMemo(() => makeAdminEnquirySchema(t.form.errors), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminEnquiryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: ADMIN_ENQUIRY_DEFAULTS,
  });

  useEffect(() => {
    if (!open) return;
    reset(enquiry ? toAdminEnquiryFormValues(enquiry) : ADMIN_ENQUIRY_DEFAULTS);
  }, [open, enquiry, reset]);

  async function onSubmit(values: AdminEnquiryFormValues) {
    const input = toAdminEnquiryInput(values);

    try {
      if (enquiry) {
        const saved = await update.mutateAsync({ id: enquiry.id, input });
        toast.success(
          fill(t.admin.enquiryUpdatedToast, { reference: saved.reference }),
        );
      } else {
        const saved = await create.mutateAsync(input);
        toast.success(
          fill(t.admin.enquiryCreatedToast, { reference: saved.reference }),
        );
      }
      onOpenChange(false);
    } catch {
      toast.error(t.admin.moveFailedTitle, {
        description: t.admin.moveFailedBody,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {enquiry ? t.admin.editEnquiry : t.admin.newEnquiry}
          </DialogTitle>
          <DialogDescription>{t.admin.enquiryFormLede}</DialogDescription>
        </DialogHeader>

        <form
          id="enquiry-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t.form.customer}
              htmlFor="enquiry-customer"
              error={errors.customerName?.message}
            >
              <Input
                id="enquiry-customer"
                {...fieldAria("enquiry-customer", errors.customerName?.message)}
                {...register("customerName")}
              />
            </Field>

            <Field
              label={t.form.phone}
              htmlFor="enquiry-admin-phone"
              error={errors.phone?.message}
            >
              <Input
                id="enquiry-admin-phone"
                type="tel"
                dir="ltr"
                className="tnum"
                placeholder="05xxxxxxxx"
                {...fieldAria("enquiry-admin-phone", errors.phone?.message)}
                {...register("phone")}
              />
            </Field>
          </div>

          <Field
            label={t.form.email}
            htmlFor="enquiry-admin-email"
            optionalLabel={t.common.optional}
            error={errors.email?.message}
          >
            <Input
              id="enquiry-admin-email"
              type="email"
              dir="ltr"
              {...fieldAria("enquiry-admin-email", errors.email?.message)}
              {...register("email")}
            />
          </Field>

          <Field
            label={t.form.message}
            htmlFor="enquiry-admin-message"
            error={errors.message?.message}
          >
            <Textarea
              id="enquiry-admin-message"
              rows={3}
              {...fieldAria("enquiry-admin-message", errors.message?.message)}
              {...register("message")}
            />
          </Field>

          <Field label={t.form.property} htmlFor="enquiry-property">
            <Select
              value={watch("propertyId") === "" ? NONE : watch("propertyId")}
              onValueChange={(value) =>
                setValue("propertyId", value === NONE ? "" : value, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="enquiry-property" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={NONE}>{t.form.propertyNone}</SelectItem>
                {(properties ?? []).map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.reference} · {text(property.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t.form.source} htmlFor="enquiry-source">
              <Select
                value={watch("source")}
                onValueChange={(value) =>
                  setValue("source", value as AdminEnquiryFormValues["source"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="enquiry-source" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENQUIRY_SOURCES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.enquirySource[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.status} htmlFor="enquiry-status">
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as AdminEnquiryFormValues["status"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="enquiry-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENQUIRY_STATUSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.enquiryStatus[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.contactPreference} htmlFor="enquiry-preference">
              <Select
                value={watch("contactPreference")}
                onValueChange={(value) =>
                  setValue(
                    "contactPreference",
                    value as AdminEnquiryFormValues["contactPreference"],
                    { shouldDirty: true },
                  )
                }
              >
                <SelectTrigger id="enquiry-preference" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_PREFERENCES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t.meta.contactPreference[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t.form.assignedTo} htmlFor="enquiry-owner">
              <Select
                value={watch("assignedTo") === "" ? NONE : watch("assignedTo")}
                onValueChange={(value) =>
                  setValue("assignedTo", value === NONE ? "" : value, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="enquiry-owner" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>{t.admin.detailAssignedNone}</SelectItem>
                  {STAFF_ROSTER.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {text(member.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label={t.admin.detailNote} htmlFor="enquiry-note">
            <Textarea
              id="enquiry-note"
              rows={2}
              placeholder={t.admin.detailNotePlaceholder}
              {...register("note")}
            />
          </Field>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t.common.cancel}
          </Button>
          <Button type="submit" form="enquiry-form" disabled={isSubmitting}>
            {enquiry ? t.common.saveChanges : t.admin.addEnquiry}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
