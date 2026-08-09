"use client";

import Link from "next/link";

import { PROPERTY_TYPES, type Property } from "@/types";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { useT } from "@/lib/i18n";
import { PROPERTY_TYPE_META } from "@/features/properties";

/**
 * The five doors into the listings. Each one carries its live count, because a
 * category that has nothing behind it should say so before the click.
 */
export function QuickSearch({ properties }: { properties: Property[] }) {
  const { t, number } = useT();

  return (
    <section className="py-16 md:py-20">
      <PageContainer>
        <SectionHead
          rail={t.nav.properties}
          title={t.home.quickTitle}
          lede={t.home.quickLede}
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PROPERTY_TYPES.map((type) => {
            const Icon = PROPERTY_TYPE_META[type].icon;
            const count = properties.filter(
              (property) => property.type === type,
            ).length;

            return (
              <li key={type}>
                <Link
                  href={`/properties?type=${type}`}
                  className="group flex h-full flex-col justify-between rounded-lg border border-limestone-200 bg-card p-5 transition-colors hover:border-petrol-400 hover:bg-petrol-50"
                >
                  <Icon
                    aria-hidden
                    className="size-6 text-petrol-600 transition-colors group-hover:text-petrol-700"
                  />
                  <div className="mt-8">
                    <p className="font-display text-base font-semibold text-petrol-950">
                      {t.meta.typePlural[type]}
                    </p>
                    <p className="tnum mt-1 text-xs text-limestone-600">
                      {number(count)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </section>
  );
}
