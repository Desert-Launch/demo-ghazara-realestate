"use client";

import { create } from "zustand";

import type { Direction, Locale } from "@/types";

/** Arabic is the default. Everything else in the app derives from this. */
export const DEFAULT_LOCALE: Locale = "ar";

export const DIRECTION_BY_LOCALE: Record<Locale, Direction> = {
  ar: "rtl",
  en: "ltr",
};

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

/**
 * The single source of truth for language *and* direction. `DirectionSync` in
 * app/providers.tsx mirrors it onto <html lang dir>; nothing else may set
 * either attribute.
 */
export const useLocaleStore = create<LocaleState>()((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => set({ locale }),
  toggleLocale: () =>
    set((state) => ({ locale: state.locale === "ar" ? "en" : "ar" })),
}));
