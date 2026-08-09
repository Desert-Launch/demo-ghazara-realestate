"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { useT } from "@/lib/i18n";
import { toEnquiryInput, useCreateEnquiry } from "@/features/enquiries";
import {
  CONTACT_FORM_DEFAULTS,
  makeContactFormSchema,
  type ContactFormValues,
} from "../schema";

/**
 * A general enquiry from /contact lands on the same board as a unit enquiry,
 * with no unit attached — which is the point of the pitch: one place, nothing
 * arriving through a side door.
 */
export function ContactForm() {
  const { t } = useT();
  const create = useCreateEnquiry();
  const schema = useMemo(() => makeContactFormSchema(t.form.errors), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: CONTACT_FORM_DEFAULTS,
  });

  async function onSubmit(values: ContactFormValues) {
    try {
      await create.mutateAsync(
        toEnquiryInput(
          {
            customerName: values.name,
            phone: values.phone,
            email: values.email,
            message: values.message,
            contactPreference: "phone",
          },
          { propertyId: null },
        ),
      );
      reset(CONTACT_FORM_DEFAULTS);
      toast.success(t.contact.successTitle, {
        description: t.contact.successBody,
      });
    } catch {
      toast.error(t.contact.errorTitle, { description: t.contact.errorBody });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field
        label={t.contact.fieldName}
        htmlFor="contact-name"
        error={errors.name?.message}
      >
        <Input
          id="contact-name"
          autoComplete="name"
          placeholder={t.contact.namePlaceholder}
          {...fieldAria("contact-name", errors.name?.message)}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t.contact.fieldPhone}
          htmlFor="contact-phone"
          error={errors.phone?.message}
        >
          <Input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            className="tnum"
            autoComplete="tel"
            placeholder={t.contact.phonePlaceholder}
            {...fieldAria("contact-phone", errors.phone?.message)}
            {...register("phone")}
          />
        </Field>

        <Field
          label={t.contact.fieldEmail}
          htmlFor="contact-email"
          optionalLabel={t.common.optional}
          error={errors.email?.message}
        >
          <Input
            id="contact-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={t.contact.emailPlaceholder}
            {...fieldAria("contact-email", errors.email?.message)}
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        label={t.contact.fieldMessage}
        htmlFor="contact-message"
        error={errors.message?.message}
      >
        <Textarea
          id="contact-message"
          rows={5}
          placeholder={t.contact.messagePlaceholder}
          {...fieldAria("contact-message", errors.message?.message)}
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t.contact.submitting : t.contact.submit}
      </Button>
    </form>
  );
}
