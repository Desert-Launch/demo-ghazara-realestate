"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "../api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  snapshot: () => [...dashboardKeys.all, "snapshot"] as const,
};

/**
 * The overview re-reads the store rather than deriving from the property and
 * enquiry caches, so it stays correct no matter which screen made the change.
 * Property and enquiry mutations invalidate their own keys; this query has a
 * short stale time so it catches up on the next visit to the screen.
 */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.snapshot(),
    queryFn: fetchDashboard,
    staleTime: 0,
  });
}
