"use client";

import { create } from "zustand";

/**
 * Saved units are a *selection*, not data the agency owns, so they live in
 * Zustand rather than the in-memory store — the same place a real build would
 * keep them before a visitor has an account. Session-only, like everything else
 * in this demo: no localStorage.
 */
interface FavouritesState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()((set, get) => ({
  ids: [],
  toggle: (id) => {
    const saved = get().ids.includes(id);
    set((state) => ({
      ids: saved
        ? state.ids.filter((current) => current !== id)
        : [id, ...state.ids],
    }));
    return !saved;
  },
  has: (id) => get().ids.includes(id),
  clear: () => set({ ids: [] }),
}));
