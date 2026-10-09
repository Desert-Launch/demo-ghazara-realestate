"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Saved units are a *selection*, not data the agency owns, so they live in
 * Zustand rather than the store — the same place a real build would keep them
 * before a visitor has an account. Kept in sessionStorage, so they survive a
 * refresh and in-app navigation for as long as the tab is open.
 *
 * `skipHydration` keeps the first client render identical to the server's
 * (nothing saved); `useRehydrateFavourites` reads the saved ids once mounted.
 */
interface FavouritesState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "desert-launch-demo:realestate:favourites",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ ids: state.ids }),
      skipHydration: true,
    },
  ),
);

/** Called once from the providers, after the first render has matched the
 *  server's. */
export function useRehydrateFavourites(): void {
  useEffect(() => {
    void useFavouritesStore.persist.rehydrate();
  }, []);
}
