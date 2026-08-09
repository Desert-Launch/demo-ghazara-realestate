"use client";

import { useState } from "react";

import type { Property } from "@/types";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FacadePlate, type PlateView } from "./facade-plate";

const VIEWS: {
  id: PlateView;
  key: "galleryElevation" | "galleryPlan" | "galleryPlot" | "gallerySection";
}[] = [
  { id: "elevation", key: "galleryElevation" },
  { id: "plan", key: "galleryPlan" },
  { id: "plot", key: "galleryPlot" },
  { id: "section", key: "gallerySection" },
];

/**
 * The unit's drawing set. Four faces of the same building rather than four
 * photographs of it — which is honest about what this demo has, and reads as
 * the agency's own file on the unit.
 */
export function PropertyGallery({ property }: { property: Property }) {
  const { t, text } = useT();
  const [view, setView] = useState<PlateView>("elevation");

  // A plot has no plan or section worth drawing; showing empty faces would be
  // filler, so land units keep the two views that mean something.
  const views = property.type === "land"
    ? VIEWS.filter((entry) => entry.id === "elevation" || entry.id === "plot")
    : VIEWS;

  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-limestone-200 bg-limestone-100">
        <div className="aspect-[16/10]">
          <FacadePlate
            property={property}
            view={view}
            label={`${text(property.title)} — ${t.property[views.find((entry) => entry.id === view)?.key ?? "galleryElevation"]}`}
          />
        </div>
      </div>

      <div
        role="tablist"
        aria-label={t.property.specsTitle}
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${views.length}, minmax(0, 1fr))` }}
      >
        {views.map((entry) => {
          const active = entry.id === view;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setView(entry.id)}
              className={cn(
                "overflow-hidden rounded-lg border bg-limestone-100 text-start transition-colors",
                active
                  ? "border-petrol-600 ring-1 ring-petrol-600"
                  : "border-limestone-200 hover:border-petrol-300",
              )}
            >
              <span className="block aspect-[4/3]">
                <FacadePlate property={property} view={entry.id} label="" />
              </span>
              <span
                className={cn(
                  "block border-t px-2 py-1.5 text-2xs font-medium",
                  active
                    ? "border-petrol-600 bg-petrol-50 text-petrol-800"
                    : "border-limestone-200 bg-card text-limestone-600",
                )}
              >
                {t.property[entry.key]}
              </span>
            </button>
          );
        })}
      </div>

      <figcaption className="mt-3 text-xs text-limestone-600">
        {t.property.galleryHint}
      </figcaption>
    </figure>
  );
}
