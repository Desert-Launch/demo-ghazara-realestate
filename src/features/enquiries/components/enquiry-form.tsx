"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CONTACT_PREFERENCES, type Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, fieldAria } from "@/components/shared/field";
import { useT } from "@/lib/i18n";
import { toEnquiryInput } from "../api";
import { useCreateEnquiry } from "../hooks/use-enquiries";
import {
  ENQUIRY_FORM_DEFAULTS,
  makeEnquiryFormSchema,
  type EnquiryFormValues,
} from "../schema";

/**
 * The public capture form. A submit writes a lead straight into the in-memory
 * store, which is the same list the admin board reads — send one here and it is
 * in the "New" column before the toast fades.
 */
export function EnquiryForm({ property }: { property: Property }) {
  const { t, fill } = useT();
  const create = useCreateEnquiry();
  const schema = useMemo(() => makeEnquiryFormSchema(t.form.errors), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: ENQUIRY_FORM_DEFAULTS,
  });

  const contactPreference = watch("contactPreference");

  async function onSubmit(values: EnquiryFormValues) {
    try {
      await create.mutateAsync(
        toEnquiryInput(values, { propertyId: property.id }),
      );
      reset(ENQUIRY_FORM_DEFAULTS);
      toast.success(t.enquiry.successTitle, {
        description: fill(t.enquiry.successBody, {
          reference: property.reference,
        }),
      });
    } catch {
      toast.error(t.enquiry.errorTitle, { description: t.enquiry.errorBody });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field
        label={t.enquiry.fieldName}
        htmlFor="enquiry-name"
        error={errors.customerName?.message}
      >
        <Input
          id="enquiry-name"
          autoComplete="name"
          {...fieldAria("enquiry-name", errors.customerName?.message)}
          {...register("customerName")}
        />
      </Field>

      <Field
        label={t.enquiry.fieldPhone}
        htmlFor="enquiry-phone"
        error={errors.phone?.message}
      >
        <Input
          id="enquiry-phone"
          type="tel"
          inputMode="tel"
          dir="ltr"
          className="tnum"
          placeholder="05xxxxxxxx"
          autoComplete="tel"
          {...fieldAria("enquiry-phone", errors.phone?.message)}
          {...register("phone")}
        />
      </Field>

      <Field
        label={t.enquiry.fieldEmail}
        htmlFor="enquiry-email"
        optionalLabel={t.common.optional}
        error={errors.email?.message}
      >
        <Input
          id="enquiry-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          {...fieldAria("enquiry-email", errors.email?.message)}
          {...register("email")}
        />
      </Field>

      <Field
        label={t.enquiry.fieldContactPreference}
        htmlFor="enquiry-contact"
      >
        <Select
          value={contactPreference}
          onValueChange={(value) =>
            setValue("contactPreference", value as EnquiryFormValues["contactPreference"])
          }
        >
          <SelectTrigger id="enquiry-contact" className="w-full">
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

      <Field
        label={t.enquiry.fieldMessage}
        htmlFor="enquiry-message"
        error={errors.message?.message}
      >
        <Textarea
          id="enquiry-message"
          rows={4}
          placeholder={t.enquiry.messagePlaceholder}
          {...fieldAria("enquiry-message", errors.message?.message)}
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.enquiry.submitting : t.enquiry.submit}
      </Button>
    </form>
  );
}
