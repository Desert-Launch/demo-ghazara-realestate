"use client";

import Link from "next/link";
import { Bath, BedDouble, Ruler } from "lucide-react";

import type { Property } from "@/types";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FavouriteButton } from "@/features/favourites";
import { PROPERTY_TYPE_META } from "../taxonomy";
import { FacadePlate } from "./facade-plate";
import { StatusBadge, TransactionPill } from "./property-badges";

interface PropertyCardProps {
  property: Property;
  /** Lets the results grid tell the district panel which pin to light up. */
  onHoverChange?: (property: Property | null) => void;
  className?: string;
}

/**
 * The card is the app's signature surface: a drawn elevation over a limestone
 * body, price set in mono at the size a buyer actually scans for, and the three
 * numbers that decide whether they click — beds, baths, area.
 */
export function PropertyCard({
  property,
  onHoverChange,
  className,
}: PropertyCardProps) {
  const { t, text, propertyPrice, number } = useT();
  const meta = PROPERTY_TYPE_META[property.type];
  const TypeIcon = meta.icon;

  return (
    <article
      className={cn("group h-full", className)}
      onMouseEnter={() => onHoverChange?.(property)}
      onMouseLeave={() => onHoverChange?.(null)}
      onFocus={() => onHoverChange?.(property)}
      onBlur={() => onHoverChange?.(null)}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-limestone-200 bg-card shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-petrol-300 group-hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-limestone-200 bg-limestone-100">
          <FacadePlate
            property={property}
            view="elevation"
            label={text(property.title)}
          />

          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <TransactionPill transaction={property.transaction} />
              {property.status !== "available" ? (
                <StatusBadge status={property.status} className="bg-limestone-50/95" />
              ) : null}
            </div>
            <FavouriteButton propertyId={property.id} />
          </div>

          <span className="tnum absolute bottom-3 start-3 rounded-full bg-limestone-50/90 px-2 py-0.5 text-2xs text-limestone-700 backdrop-blur">
            {property.reference}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="flex items-center gap-1.5 text-xs text-limestone-600">
            <TypeIcon aria-hidden className="size-3.5" />
            {t.meta.type[property.type]}
            <span aria-hidden>·</span>
            {t.meta.district[property.district]}
          </p>

          <h3 className="mt-1.5 text-balance font-display text-base font-semibold text-petrol-950">
            {/* The whole card is one link; the heading carries it so the
                accessible name is the unit, not "read more". */}
            <Link href={`/properties/${property.id}`} className="after:absolute after:inset-0">
              {text(property.title)}
            </Link>
          </h3>

          <p className="tnum mt-3 text-lg font-semibold text-petrol-800">
            {propertyPrice(property)}
          </p>

          <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-limestone-200 pt-3 text-xs text-limestone-700">
            {meta.hasRooms ? (
              <>
                <div className="flex items-center gap-1.5">
                  <BedDouble aria-hidden className="size-3.5 text-limestone-500" />
                  <dt className="sr-only">{t.property.specBeds}</dt>
                  <dd className="tnum">{number(property.beds)}</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath aria-hidden className="size-3.5 text-limestone-500" />
                  <dt className="sr-only">{t.property.specBaths}</dt>
                  <dd className="tnum">{number(property.baths)}</dd>
                </div>
              </>
            ) : null}
            <div className="flex items-center gap-1.5">
              <Ruler aria-hidden className="size-3.5 text-limestone-500" />
              <dt className="sr-only">{t.property.specArea}</dt>
              <dd className="tnum">
                {number(property.areaSqm)} {t.common.sqm}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-limestone-200 bg-card">
      <div className="aspect-[4/3] animate-pulse bg-limestone-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-limestone-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-limestone-100" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-limestone-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-limestone-100" />
      </div>
    </div>
  );
}
