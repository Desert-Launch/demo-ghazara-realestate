"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";
import { PropertyCard, PropertyCardSkeleton } from "@/features/properties";

interface FeaturedRailProps {
  properties: Property[];
  isPending: boolean;
}

export function FeaturedRail({ properties, isPending }: FeaturedRailProps) {
  const { t } = useT();

  // Featured first; if the agency has not flagged enough, the newest fill in.
  const featured = properties.filter((property) => property.featured);
  const rest = properties.filter((property) => !property.featured);
  const shown = [...featured, ...rest].slice(0, 4);

  return (
    <section className="border-y border-limestone-200 bg-limestone-100/70 py-16 md:py-20">
      <PageContainer>
        <SectionHead
          rail={t.home.featuredRail}
          title={t.home.featuredTitle}
          lede={t.home.featuredLede}
          action={
            <Button asChild variant="outline">
              <Link href="/properties">
                {t.home.featuredAll}
                <ArrowLeft
                  data-icon="inline-end"
                  aria-hidden
                  className="ltr:-scale-x-100"
                />
              </Link>
            </Button>
          }
        />

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {isPending
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index}>
                  <PropertyCardSkeleton />
                </li>
              ))
            : shown.map((property) => (
                <li key={property.id}>
                  <PropertyCard property={property} />
                </li>
              ))}
        </ul>
      </PageContainer>
    </section>
  );
}
