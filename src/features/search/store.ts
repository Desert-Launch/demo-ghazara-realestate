"use client";

import { create } from "zustand";

import { DEFAULT_FILTERS, type PropertyFilters } from "./filters";

interface SearchState {
  filters: PropertyFilters;
  set: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => void;
  /** Adds or removes one value from a multi-select facet. */
  toggleIn: <K extends "types" | "districts">(
    key: K,
    value: PropertyFilters[K][number],
  ) => void;
  replaceAll: (filters: PropertyFilters) => void;
  clear: () => void;
}

/**
 * Filter state lives in Zustand rather than in the URL, so every control reads
 * and writes one object. `FilterUrlSync` mirrors it into the query string (and
 * hydrates from there once on mount), which keeps a shared link honest without
 * making the URL the source of truth for a dozen controls.
 */
export const useSearchStore = create<SearchState>()((set) => ({
  filters: DEFAULT_FILTERS,
  set: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  toggleIn: (key, value) =>
    set((state) => {
      const current = state.filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      return { filters: { ...state.filters, [key]: next } };
    }),
  replaceAll: (filters) => set({ filters }),
  // Sort survives a clear: it is an ordering the visitor chose, not a filter.
  clear: () =>
    set((state) => ({ filters: { ...DEFAULT_FILTERS, sort: state.filters.sort } })),
}));
