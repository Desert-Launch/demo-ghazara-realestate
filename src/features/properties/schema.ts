import { z } from "zod";

import {
  AMENITIES,
  DISTRICTS,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  RENT_PERIODS,
  TRANSACTION_TYPES,
} from "@/types";
import type { Dictionary } from "@/lib/i18n/ar";
import { fill } from "@/lib/i18n";

type FormErrors = Dictionary["form"]["errors"];

/**
 * Validation messages are copy, so the schema is built from the active
 * dictionary rather than hard-coding English. Components call this inside a
 * `useMemo` keyed on the locale.
 */
export function makePropertyFormSchema(e: FormErrors) {
  const requiredText = (min: number) =>
    z
      .string()
      .trim()
      .min(1, e.required)
      .min(min, fill(e.tooShort, { count: min }));

  return z
    .object({
      titleAr: requiredText(8),
      titleEn: requiredText(8),
      descriptionAr: requiredText(20),
      descriptionEn: requiredText(20),
      type: z.enum(PROPERTY_TYPES),
      transaction: z.enum(TRANSACTION_TYPES),
      district: z.enum(DISTRICTS),
      status: z.enum(PROPERTY_STATUSES),
      priceSar: z
        .number({ error: e.required })
        .int()
        .positive(e.positive)
        .max(200_000_000, fill(e.max, { count: 200_000_000 })),
      rentPeriod: z.enum(RENT_PERIODS),
      areaSqm: z
        .number({ error: e.required })
        .positive(e.positive)
        .max(20_000, fill(e.max, { count: 20_000 })),
      beds: z.number({ error: e.required }).int().min(0).max(20),
      baths: z.number({ error: e.required }).int().min(0).max(20),
      livingRooms: z.number({ error: e.required }).int().min(0).max(10),
      /** Kept as text so "no floor" is an empty field, not a magic number. */
      floor: z
        .string()
        .trim()
        .refine(
          (value) => value === "" || /^\d{1,2}$/.test(value),
          fill(e.max, { count: 40 }),
        ),
      ageYears: z.number({ error: e.required }).int().min(0).max(60),
      furnished: z.boolean(),
      featured: z.boolean(),
      amenities: z.array(z.enum(AMENITIES)),
    })
    .refine(
      // A villa or a plot has no floor number; anything inside a building may.
      (values) =>
        values.floor === "" ||
        values.type === "apartment" ||
        values.type === "floor" ||
        values.type === "commercial",
      { path: ["floor"], message: e.required },
    );
}

export type PropertyFormValues = z.infer<
  ReturnType<typeof makePropertyFormSchema>
>;

export const PROPERTY_FORM_DEFAULTS: PropertyFormValues = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  type: "apartment",
  transaction: "sale",
  district: "narjis",
  status: "available",
  priceSar: 900_000,
  rentPeriod: "yearly",
  areaSqm: 150,
  beds: 3,
  baths: 2,
  livingRooms: 1,
  floor: "1",
  ageYears: 0,
  furnished: false,
  featured: false,
  amenities: [],
};
