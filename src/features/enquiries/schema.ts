import { z } from "zod";

import {
  CONTACT_PREFERENCES,
  ENQUIRY_SOURCES,
  ENQUIRY_STATUSES,
} from "@/types";
import type { Dictionary } from "@/lib/i18n/ar";
import { fill } from "@/lib/i18n";

type FormErrors = Dictionary["form"]["errors"];

/** Saudi mobile numbers: ten digits starting 05. */
const SAUDI_MOBILE = /^05\d{8}$/;

/** What a visitor fills in on a property page. */
export function makeEnquiryFormSchema(e: FormErrors) {
  return z.object({
    customerName: z
      .string()
      .trim()
      .min(1, e.required)
      .min(3, fill(e.tooShort, { count: 3 })),
    phone: z
      .string()
      .trim()
      .min(1, e.required)
      .regex(SAUDI_MOBILE, e.phone),
    // Optional, but if they typed something it has to be reachable.
    email: z.union([z.literal(""), z.email(e.email)]),
    message: z
      .string()
      .trim()
      .min(1, e.required)
      .min(10, fill(e.tooShort, { count: 10 })),
    contactPreference: z.enum(CONTACT_PREFERENCES),
  });
}

export type EnquiryFormValues = z.infer<ReturnType<typeof makeEnquiryFormSchema>>;

export const ENQUIRY_FORM_DEFAULTS: EnquiryFormValues = {
  customerName: "",
  phone: "",
  email: "",
  message: "",
  contactPreference: "whatsapp",
};

/** What staff fill in for a phone or walk-in lead, plus the fields they own. */
export function makeAdminEnquirySchema(e: FormErrors) {
  return makeEnquiryFormSchema(e).extend({
    /** "" means a general enquiry not tied to a unit. */
    propertyId: z.string(),
    source: z.enum(ENQUIRY_SOURCES),
    status: z.enum(ENQUIRY_STATUSES),
    /** "" means nobody has picked it up yet. */
    assignedTo: z.string(),
    note: z.string(),
  });
}

export type AdminEnquiryFormValues = z.infer<
  ReturnType<typeof makeAdminEnquirySchema>
>;

export const ADMIN_ENQUIRY_DEFAULTS: AdminEnquiryFormValues = {
  ...ENQUIRY_FORM_DEFAULTS,
  contactPreference: "phone",
  propertyId: "",
  source: "phone",
  status: "new",
  assignedTo: "",
  note: "",
};
