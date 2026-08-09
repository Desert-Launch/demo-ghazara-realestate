"use client";

import { useT } from "@/lib/i18n";

/** First tab stop on every page, in whichever language is active. */
export function SkipLink() {
  const { t } = useT();

  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-petrol-700 px-4 py-2 text-sm text-limestone-50 focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-50"
    >
      {t.common.skipToContent}
    </a>
  );
}
