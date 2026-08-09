"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DirectionSync } from "@/components/layout/direction-sync";
import { makeQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionSync />
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      {/* Bottom-centre works in both directions without moving. */}
      <Toaster theme="light" position="bottom-center" closeButton />
    </QueryClientProvider>
  );
}
