import { z } from "zod";

import type { Dictionary } from "@/lib/i18n/ar";
import { fill } from "@/lib/i18n";

type FormErrors = Dictionary["form"]["errors"];

const SAUDI_MOBILE = /^05\d{8}$/;

export function makeContactFormSchema(e: FormErrors) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, e.required)
      .min(3, fill(e.tooShort, { count: 3 })),
    phone: z.string().trim().min(1, e.required).regex(SAUDI_MOBILE, e.phone),
    email: z.union([z.literal(""), z.email(e.email)]),
    message: z
      .string()
      .trim()
      .min(1, e.required)
      .min(10, fill(e.tooShort, { count: 10 })),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof makeContactFormSchema>
>;

export const CONTACT_FORM_DEFAULTS: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  message: "",
};
