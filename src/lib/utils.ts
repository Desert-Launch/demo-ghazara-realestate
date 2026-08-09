import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { arSA, enGB } from "date-fns/locale";
import { format, formatDistanceToNowStrict, isToday } from "date-fns";

import type { Locale } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fake network time, so loading and skeleton states are real and demoable. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Both locales use Western digits.
 *
 * Saudi property listings — aqar.fm, the big brokerages, the ministry's own
 * portals — are written with Western digits even in Arabic copy, and a price
 * column only lines up if every row uses the same numerals. So the choice is
 * "Western, consistently" rather than one set per locale.
 */
const NUMBER_LOCALE = "en-US";

export function formatNumber(value: number): string {
  return value.toLocaleString(NUMBER_LOCALE);
}

/** Long prices shorten on cards: 1,250,000 → "1.25M" / "1.25 مليون". */
export function formatCompactSar(value: number, locale: Locale): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const digits = millions >= 10 ? 1 : 2;
    const number = Number(millions.toFixed(digits)).toLocaleString(
      NUMBER_LOCALE,
    );
    return locale === "ar" ? `${number} مليون` : `${number}M`;
  }
  if (value >= 10_000) {
    const thousands = Math.round(value / 1_000);
    const number = thousands.toLocaleString(NUMBER_LOCALE);
    return locale === "ar" ? `${number} ألف` : `${number}K`;
  }
  return formatNumber(value);
}

const dateLocales = { ar: arSA, en: enGB } as const;

export function formatDate(value: string | Date, locale: Locale): string {
  return format(new Date(value), "d MMMM yyyy", {
    locale: dateLocales[locale],
  });
}

export function formatShortDate(value: string | Date, locale: Locale): string {
  return format(new Date(value), "d MMM yyyy", { locale: dateLocales[locale] });
}

export function formatDayTime(value: string | Date, locale: Locale): string {
  const date = new Date(value);
  const time = format(date, "HH:mm");
  return isToday(date)
    ? time
    : `${format(date, "d MMM", { locale: dateLocales[locale] })} · ${time}`;
}

/** "منذ ٣ ساعات" / "3 hours ago" — used on lead cards. */
export function formatAgo(value: string | Date, locale: Locale): string {
  return formatDistanceToNowStrict(new Date(value), {
    addSuffix: true,
    locale: dateLocales[locale],
  });
}

/** Stable small hash — turns an id into the seed for a drawn facade. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/** Deterministic 0–1 from a seed and a channel name. */
export function seededUnit(seed: string, channel: string): number {
  return (hashString(`${seed}:${channel}`) % 1000) / 1000;
}

/** Deterministic integer in [min, max]. */
export function seededInt(
  seed: string,
  channel: string,
  min: number,
  max: number,
): number {
  return min + Math.floor(seededUnit(seed, channel) * (max - min + 1));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
