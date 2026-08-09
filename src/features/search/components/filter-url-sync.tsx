"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { filtersFromSearchParams, filtersToSearchParams } from "../filters";
import { useSearchStore } from "../store";

/**
 * Keeps the query string and the filter store in step.
 *
 * On mount the URL wins once, so a shared link opens on the filters it
 * describes. After that the store wins, and every change is written back with
 * `replace` — filtering is not navigation, and it should not fill the back
 * button with a dozen entries.
 */
export function FilterUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useSearchStore((state) => state.filters);
  const replaceAll = useSearchStore((state) => state.replaceAll);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    replaceAll(filtersFromSearchParams(new URLSearchParams(searchParams)));
  }, [searchParams, replaceAll]);

  useEffect(() => {
    if (!hydrated.current) return;
    const next = filtersToSearchParams(filters);
    const current = searchParams.toString();
    if (next === current) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [filters, pathname, router, searchParams]);

  return null;
}
