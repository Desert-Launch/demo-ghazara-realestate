"use client";

import { useEffect } from "react";

import { DIRECTION_BY_LOCALE, useLocaleStore } from "@/lib/i18n";

/**
 * Mirrors the locale store onto `<html lang dir>`.
 *
 * The server already renders `lang="ar" dir="rtl"`, which is the store's
 * default, so the first paint matches and there is nothing to hydrate around.
 * Nothing else in the app may write these attributes.
 */
export function DirectionSync() {
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = DIRECTION_BY_LOCALE[locale];
  }, [locale]);

  return null;
}
