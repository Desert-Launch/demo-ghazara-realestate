"use client";

import { useCallback, useMemo } from "react";

import type { Direction, Locale, LocalizedText, Property } from "@/types";
import { formatNumber } from "@/lib/utils";
import { ar, type Dictionary } from "./ar";
import { en } from "./en";
import {
  DEFAULT_LOCALE,
  DIRECTION_BY_LOCALE,
  useLocaleStore,
} from "./store";

const DICTIONARIES: Record<Locale, Dictionary> = { ar, en };

/** Fills `{name}` placeholders. Values are stringified, never interpreted. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Picks the right side of a bilingual data field. */
export function localized(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export interface Translator {
  locale: Locale;
  dir: Direction;
  /** True when the document is right-to-left. Prefer logical CSS over this. */
  isRtl: boolean;
  t: Dictionary;
  fill: typeof fill;
  /** Reads a bilingual field from the store in the active language. */
  text: (value: LocalizedText) => string;
  /** "1,250,000 ر.س" / "SAR 1,250,000". */
  price: (value: number) => string;
  /** Price plus the rent period where one applies. */
  propertyPrice: (property: Pick<Property, "priceSar" | "rentPeriod">) => string;
  /** "320 م²" / "320 m²". */
  area: (sqm: number) => string;
  number: (value: number) => string;
}

/**
 * The one hook every component uses for copy, direction and number formatting.
 * Client-only: language is switchable at runtime, so any component that renders
 * user-facing text is a client component.
 */
export function useT(): Translator {
  const locale = useLocaleStore((state) => state.locale);

  const text = useCallback(
    (value: LocalizedText) => value[locale],
    [locale],
  );

  return useMemo(() => {
    const dictionary = DICTIONARIES[locale];
    const dir = DIRECTION_BY_LOCALE[locale];

    const price = (value: number) =>
      locale === "ar"
        ? `${formatNumber(value)} ${dictionary.common.sar}`
        : `${dictionary.common.sar} ${formatNumber(value)}`;

    return {
      locale,
      dir,
      isRtl: dir === "rtl",
      t: dictionary,
      fill,
      text,
      price,
      propertyPrice: ({ priceSar, rentPeriod }) => {
        const base = price(priceSar);
        if (!rentPeriod) return base;
        const period =
          rentPeriod === "monthly"
            ? dictionary.common.perMonth
            : dictionary.common.perYear;
        return `${base} / ${period}`;
      },
      area: (sqm) => `${formatNumber(sqm)} ${dictionary.common.sqm}`,
      number: formatNumber,
    };
  }, [locale, text]);
}

export { ar, en, DEFAULT_LOCALE, DIRECTION_BY_LOCALE, useLocaleStore };
export type { Dictionary };
