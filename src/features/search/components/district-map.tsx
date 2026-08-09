"use client";

import { useMemo } from "react";

import type { District, Property } from "@/types";
import { DISTRICT_ROADS, DISTRICT_SHAPES, districtCentre } from "@/lib/districts";
import { useT } from "@/lib/i18n";
import { cn, seededInt } from "@/lib/utils";
import { PROPERTY_STATUS_META } from "@/features/properties";

interface DistrictMapProps {
  properties: Property[];
  /** The card the visitor is pointing at, so its pin can answer. */
  activeId: string | null;
  selected: District[];
  onToggleDistrict: (district: District) => void;
  className?: string;
}

/**
 * A drawn diagram of the districts, not a map integration — no tiles, no map
 * library, no coordinates. It exists to answer "where is this?" at a glance and
 * to let someone filter by pointing. Pins light up when the matching card is
 * hovered, and a district can be toggled straight from here.
 *
 * The panel is a picture of a place, so it keeps physical left/top positioning
 * in both directions: mirroring it in RTL would move Al Arid to the wrong side
 * of Riyadh.
 */
export function DistrictMap({
  properties,
  activeId,
  selected,
  onToggleDistrict,
  className,
}: DistrictMapProps) {
  const { t, number } = useT();

  const countByDistrict = useMemo(() => {
    const counts = new Map<District, number>();
    for (const property of properties) {
      counts.set(property.district, (counts.get(property.district) ?? 0) + 1);
    }
    return counts;
  }, [properties]);

  const pins = useMemo(
    () =>
      properties.map((property) => {
        const centre = districtCentre(property.district);
        return {
          property,
          x: centre.x + seededInt(property.id, "pinx", -7, 7),
          y: centre.y + seededInt(property.id, "piny", -6, 6),
        };
      }),
    [properties],
  );

  return (
    <div className={cn("overflow-hidden rounded-xl border border-limestone-200 bg-limestone-50", className)}>
      <div className="flex items-baseline justify-between gap-3 border-b border-limestone-200 px-4 py-3">
        <h2 className="font-display text-sm font-semibold text-petrol-900">
          {t.properties.mapTitle}
        </h2>
        <p className="tnum text-xs text-limestone-600">
          {number(properties.length)}
        </p>
      </div>

      <div className="relative aspect-[5/6] bg-limestone-100">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          {DISTRICT_ROADS.map((road) => (
            <path
              key={road.id}
              d={road.d}
              fill="none"
              stroke="var(--gz-limestone-300)"
              strokeWidth="2.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {DISTRICT_SHAPES.map((shape) => {
            const isSelected = selected.includes(shape.id);
            const count = countByDistrict.get(shape.id) ?? 0;

            return (
              <polygon
                key={shape.id}
                points={shape.points}
                fill={
                  isSelected
                    ? "color-mix(in srgb, var(--gz-petrol-500) 26%, transparent)"
                    : count > 0
                      ? "color-mix(in srgb, var(--gz-petrol-500) 9%, transparent)"
                      : "transparent"
                }
                stroke={
                  isSelected ? "var(--gz-petrol-700)" : "var(--gz-limestone-400)"
                }
                strokeWidth={isSelected ? 1.6 : 1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* Labels and pins sit in an HTML layer so Arabic sets properly. */}
        <div className="absolute inset-0">
          {DISTRICT_SHAPES.map((shape) => {
            const count = countByDistrict.get(shape.id) ?? 0;
            const isSelected = selected.includes(shape.id);

            return (
              <button
                key={shape.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggleDistrict(shape.id)}
                style={{ left: `${shape.centre.x}%`, top: `${shape.centre.y}%` }}
                className={cn(
                  // The panel is small on a phone; the labels shrink and drop
                  // their counts rather than overlapping each other.
                  "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] font-medium transition-colors sm:px-2 sm:text-2xs",
                  isSelected
                    ? "border-petrol-700 bg-petrol-700 text-limestone-50"
                    : "border-limestone-300 bg-limestone-50/85 text-limestone-700 hover:border-petrol-400 hover:text-petrol-800",
                )}
              >
                {t.meta.district[shape.id]}
                {count > 0 ? (
                  <span className="tnum ms-1 hidden opacity-70 sm:inline">
                    {number(count)}
                  </span>
                ) : null}
              </button>
            );
          })}

          {pins.map((pin) => {
            const isActive = pin.property.id === activeId;
            return (
              <span
                key={pin.property.id}
                aria-hidden
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className={cn(
                  "absolute block -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-limestone-50 transition-all duration-200",
                  isActive
                    ? "z-10 size-4 bg-clay-500 shadow-md"
                    : "size-2",
                  !isActive && PROPERTY_STATUS_META[pin.property.status].dotClass,
                )}
              />
            );
          })}
        </div>
      </div>

      <p className="border-t border-limestone-200 px-4 py-3 text-xs text-limestone-600">
        {t.properties.mapNote}
      </p>
    </div>
  );
}
