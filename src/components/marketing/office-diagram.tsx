"use client";

import { useT } from "@/lib/i18n";

/**
 * Where the office sits, drawn as a block plan.
 *
 * Not a map integration — there is no tile server, no coordinates and no map
 * library in this project. It is a diagram of the junction, which is what
 * somebody actually needs to find a door on Anas Ibn Malik Road.
 *
 * Like the district panel, it keeps physical left/top positioning in both
 * directions: mirroring a place would move the office to the wrong corner.
 */
export function OfficeDiagram() {
  const { t } = useT();

  return (
    <div className="relative aspect-[4/3] bg-limestone-100">
      <svg
        viewBox="0 0 100 75"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        {/* The arterial and the side street. */}
        <rect x="0" y="30" width="100" height="12" fill="var(--gz-limestone-300)" />
        <rect x="58" y="0" width="9" height="75" fill="var(--gz-limestone-300)" />
        <line
          x1="0"
          y1="36"
          x2="100"
          y2="36"
          stroke="var(--gz-limestone-50)"
          strokeWidth="1"
          strokeDasharray="6 5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Blocks either side. */}
        {[
          { x: 8, y: 8, w: 40, h: 16 },
          { x: 8, y: 50, w: 40, h: 18 },
          { x: 72, y: 8, w: 22, h: 16 },
          { x: 72, y: 50, w: 22, h: 18 },
        ].map((block) => (
          <rect
            key={`${block.x}-${block.y}`}
            {...{ x: block.x, y: block.y, width: block.w, height: block.h }}
            fill="none"
            stroke="var(--gz-limestone-400)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* The office block itself. */}
        <rect
          x="40"
          y="48"
          width="14"
          height="14"
          fill="color-mix(in srgb, var(--gz-petrol-500) 22%, transparent)"
          stroke="var(--gz-petrol-700)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        style={{ left: "47%", top: "73%" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-petrol-700 bg-petrol-700 px-2 py-0.5 text-2xs font-medium text-limestone-50"
      >
        {t.brand.short}
      </span>
      <span
        style={{ left: "20%", top: "48%" }}
        className="absolute -translate-y-1/2 rounded-full bg-limestone-50/85 px-2 py-0.5 text-2xs text-limestone-700"
      >
        {t.home.visitAddress}
      </span>
    </div>
  );
}
