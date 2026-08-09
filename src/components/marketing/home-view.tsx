"use client";

import { FeaturedRail } from "@/components/marketing/featured-rail";
import { Hero } from "@/components/marketing/hero";
import { QuickSearch } from "@/components/marketing/quick-search";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { VisitPanel } from "@/components/marketing/visit-panel";
import { usePublicProperties } from "@/features/properties";

/**
 * The home page reads through the same TanStack query as the listings, so a
 * unit added in the dashboard shows up here on the next invalidation without
 * anything else having to know about it.
 */
export function HomeView() {
  const { data, isPending } = usePublicProperties();
  const properties = data ?? [];

  return (
    <>
      <Hero unitCount={properties.length} />
      <QuickSearch properties={properties} />
      <FeaturedRail properties={properties} isPending={isPending} />
      <TrustStrip />
      <VisitPanel />
    </>
  );
}
