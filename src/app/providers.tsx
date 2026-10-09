"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DirectionSync } from "@/components/layout/direction-sync";
import { useRehydrateFavourites } from "@/features/favourites";
import { makeQueryClient } from "@/lib/query-client";
import { onStoreChange } from "@/lib/store/persist";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  useRehydrateFavourites();

  // An enquiry sent in another tab lands in this one's store; refetch so an
  // open board shows it without a refresh.
  useEffect(() => onStoreChange(() => void queryClient.invalidateQueries()), [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionSync />
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      {/* Bottom-centre works in both directions without moving. */}
      <Toaster theme="light" position="bottom-center" closeButton />
    </QueryClientProvider>
  );
}
