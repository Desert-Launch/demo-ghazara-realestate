"use client";

import type { Property } from "@/types";
import { useT } from "@/lib/i18n";
import { formatShortDate } from "@/lib/utils";
import { PROPERTY_TYPE_META } from "../taxonomy";

interface Row {
  label: string;
  value: string;
}

/**
 * Every number a buyer checks before calling, in one block. Rows that do not
 * apply to the unit are left out rather than shown as a dash — a plot has no
 * bathroom count, and printing "—" four times reads as missing data.
 */
export function SpecList({ property }: { property: Property }) {
  const { t, fill, number, locale } = useT();
  const meta = PROPERTY_TYPE_META[property.type];

  const rows: Row[] = [
    { label: t.property.specType, value: t.meta.type[property.type] },
    { label: t.property.specDistrict, value: t.meta.district[property.district] },
    {
      label: t.property.specArea,
      value: `${number(property.areaSqm)} ${t.common.sqm}`,
    },
  ];

  if (meta.hasRooms) {
    rows.push(
      { label: t.property.specBeds, value: number(property.beds) },
      { label: t.property.specBaths, value: number(property.baths) },
      { label: t.property.specLiving, value: number(property.livingRooms) },
    );
  }

  if (meta.hasFloor && property.floor !== null) {
    rows.push({ label: t.property.specFloor, value: number(property.floor) });
  }

  rows.push({
    label: t.property.specAge,
    value:
      property.ageYears === 0
        ? t.property.specAgeNew
        : fill(t.property.specAgeYears, { count: number(property.ageYears) }),
  });

  if (meta.hasRooms) {
    rows.push({
      label: t.property.specFurnished,
      value: property.furnished
        ? t.property.specFurnishedYes
        : t.property.specFurnishedNo,
    });
  }

  rows.push(
    { label: t.common.reference, value: property.reference },
    {
      label: t.property.specListed,
      value: formatShortDate(property.createdAt, locale),
    },
  );

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-limestone-200 bg-limestone-200 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="bg-card px-4 py-3.5">
          <dt className="text-xs text-limestone-600">{row.label}</dt>
          <dd className="tnum mt-1 text-sm font-medium text-petrol-900">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
