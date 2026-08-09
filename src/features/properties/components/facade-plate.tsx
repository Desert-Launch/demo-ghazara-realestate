import type { CSSProperties } from "react";

import type { Property } from "@/types";
import { cn, seededInt } from "@/lib/utils";
import { PROPERTY_TYPE_META } from "../taxonomy";

/**
 * The signature element.
 *
 * We have no photographs — and stock skyline imagery is exactly the cliché this
 * identity is built to avoid — so every unit gets a drawn plate instead: a
 * measured elevation, plan, plot and section in petrol ink on limestone paper,
 * the way the agency's own file on a unit would look. The drawing is derived
 * deterministically from the unit's id, so a given unit always looks like
 * itself, and a grid of thirty of them reads as one drawing set.
 *
 * Pure SVG, no images, no external assets.
 */

export type PlateView = "elevation" | "plan" | "plot" | "section";

interface FacadePlateProps {
  property: Property;
  view?: PlateView;
  className?: string;
  /** Decorative in a card; the detail gallery gives it a real label. */
  label?: string;
}

const INK = "var(--gz-petrol-800)";
const INK_SOFT = "color-mix(in srgb, var(--gz-petrol-800) 42%, transparent)";
const INK_FAINT = "color-mix(in srgb, var(--gz-petrol-800) 18%, transparent)";
const GLASS = "color-mix(in srgb, var(--gz-petrol-500) 26%, transparent)";

export function FacadePlate({
  property,
  view = "elevation",
  className,
  label,
}: FacadePlateProps) {
  const meta = PROPERTY_TYPE_META[property.type];
  const style = {
    "--plate-sky": meta.skyVar,
    "--plate-wall": meta.wallVar,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 320 220"
      role="img"
      aria-label={label ?? property.title.en}
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      style={style}
    >
      <rect width="320" height="220" fill="var(--plate-sky)" />
      <SheetGrid />
      {view === "elevation" ? <Elevation property={property} /> : null}
      {view === "plan" ? <Plan property={property} /> : null}
      {view === "plot" ? <Plot property={property} /> : null}
      {view === "section" ? <Section property={property} /> : null}
    </svg>
  );
}

/** The faint square grid of the drawing sheet, under every view. */
function SheetGrid() {
  return (
    <g stroke={INK_FAINT} strokeWidth="0.5">
      {Array.from({ length: 15 }, (_, index) => (
        <line
          key={`v${index}`}
          x1={(index + 1) * 20}
          y1="0"
          x2={(index + 1) * 20}
          y2="220"
        />
      ))}
      {Array.from({ length: 10 }, (_, index) => (
        <line
          key={`h${index}`}
          x1="0"
          y1={(index + 1) * 20}
          x2="320"
          y2={(index + 1) * 20}
        />
      ))}
    </g>
  );
}

/* --- Elevation ------------------------------------------------------------ */

function Elevation({ property }: { property: Property }) {
  const seed = property.id;
  const ground = 186;

  if (property.type === "land") return <LandElevation property={property} />;
  if (property.type === "commercial") {
    return <CommercialElevation property={property} ground={ground} />;
  }

  const isVilla = property.type === "villa";
  const storeys = isVilla ? 2 : Math.max(3, Math.min(6, (property.floor ?? 2) + 2));
  const storeyHeight = isVilla ? 52 : Math.min(30, 120 / storeys);
  const bodyHeight = storeys * storeyHeight;
  const width = isVilla ? 214 : 178;
  const x = (320 - width) / 2 + seededInt(seed, "shift", -8, 8);
  const top = ground - bodyHeight;
  const columns = Math.max(3, Math.min(6, property.beds + 1));

  return (
    <g>
      <GroundLine y={ground} />

      {/* Boundary wall and gate — how a Riyadh villa actually meets the street. */}
      {isVilla ? (
        <g>
          <rect
            x={x - 16}
            y={ground - 34}
            width={width + 32}
            height="34"
            fill="var(--plate-wall)"
            stroke={INK_SOFT}
            strokeWidth="1.5"
          />
          <rect
            x={x + width / 2 - 26}
            y={ground - 30}
            width="52"
            height="30"
            fill={GLASS}
            stroke={INK}
            strokeWidth="1.5"
          />
          {Array.from({ length: 7 }, (_, index) => (
            <line
              key={index}
              x1={x + width / 2 - 20 + index * 7}
              y1={ground - 27}
              x2={x + width / 2 - 20 + index * 7}
              y2={ground - 3}
              stroke={INK_SOFT}
              strokeWidth="1"
            />
          ))}
        </g>
      ) : null}

      {/* The body. */}
      <rect
        x={x}
        y={top}
        width={width}
        height={bodyHeight}
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="1.75"
      />

      {/* Parapet: a shallow stepped cap, not a cornice. */}
      <rect
        x={x - 7}
        y={top - 9}
        width={width + 14}
        height="9"
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="1.75"
      />

      {/* Storey lines. */}
      {Array.from({ length: storeys - 1 }, (_, index) => (
        <line
          key={index}
          x1={x}
          y1={top + (index + 1) * storeyHeight}
          x2={x + width}
          y2={top + (index + 1) * storeyHeight}
          stroke={INK_SOFT}
          strokeWidth="1"
        />
      ))}

      {/* Window grid. The bottom storey carries the entrance instead. */}
      {Array.from({ length: storeys }, (_, row) =>
        Array.from({ length: columns }, (_, column) => {
          const isEntranceBay =
            row === storeys - 1 && column === Math.floor(columns / 2);
          const cellWidth = width / columns;
          const wx = x + column * cellWidth + cellWidth * 0.24;
          const ww = cellWidth * 0.52;
          const wy = top + row * storeyHeight + storeyHeight * 0.24;
          const wh = storeyHeight * 0.46;

          if (isEntranceBay) {
            return (
              <rect
                key={`${row}-${column}`}
                x={wx}
                y={top + row * storeyHeight + storeyHeight * 0.3}
                width={ww}
                height={storeyHeight * 0.7}
                fill={GLASS}
                stroke={INK}
                strokeWidth="1.25"
              />
            );
          }

          // A shuttered window here and there keeps the grid from looking printed.
          const shuttered = seededInt(seed, `w${row}${column}`, 0, 9) === 0;
          return (
            <rect
              key={`${row}-${column}`}
              x={wx}
              y={wy}
              width={ww}
              height={wh}
              fill={shuttered ? "var(--plate-wall)" : GLASS}
              stroke={INK_SOFT}
              strokeWidth="1.25"
            />
          );
        }),
      )}

      {/* Balconies, where the unit has one. */}
      {property.amenities.includes("balcony") ? (
        <line
          x1={x + 8}
          y1={top + storeyHeight}
          x2={x + width - 8}
          y2={top + storeyHeight}
          stroke={INK}
          strokeWidth="3"
        />
      ) : null}

      <SidePalm x={x - 34} ground={ground} seed={seed} />
      <DimensionRail y={ground + 16} label={`${property.areaSqm} m²`} />
    </g>
  );
}

function CommercialElevation({
  property,
  ground,
}: {
  property: Property;
  ground: number;
}) {
  const x = 54;
  const width = 212;
  const top = ground - 108;

  return (
    <g>
      <GroundLine y={ground} />
      <rect
        x={x}
        y={top}
        width={width}
        height={108}
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="1.75"
      />
      {/* Signage band — the one thing a shopfront always has. */}
      <rect
        x={x}
        y={top}
        width={width}
        height="26"
        fill={INK_SOFT}
        stroke={INK}
        strokeWidth="1.5"
      />
      {/* Glazed frontage. */}
      <rect
        x={x + 12}
        y={top + 40}
        width={width - 24}
        height="56"
        fill={GLASS}
        stroke={INK}
        strokeWidth="1.5"
      />
      {Array.from({ length: 3 }, (_, index) => (
        <line
          key={index}
          x1={x + 12 + ((index + 1) * (width - 24)) / 4}
          y1={top + 40}
          x2={x + 12 + ((index + 1) * (width - 24)) / 4}
          y2={top + 96}
          stroke={INK}
          strokeWidth="1.25"
        />
      ))}
      <DimensionRail y={ground + 16} label={`${property.areaSqm} m²`} />
    </g>
  );
}

function LandElevation({ property }: { property: Property }) {
  const ratio = 1.5;
  const depth = Math.round(Math.sqrt(property.areaSqm / ratio));
  const frontage = Math.round(depth * ratio);

  return (
    <g>
      <GroundLine y={186} />
      {/* The plot itself, drawn in plan even on the "elevation" face — a plot
          has no elevation to draw, and pretending otherwise would be noise. */}
      <rect
        x="66"
        y="52"
        width="188"
        height="112"
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="1.75"
        strokeDasharray="7 4"
      />
      <g stroke={INK_FAINT} strokeWidth="1">
        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={index}
            x1={66 + (index + 1) * 27}
            y1="52"
            x2={66 + (index + 1) * 27}
            y2="164"
          />
        ))}
      </g>
      <DimensionArrow x1={66} x2={254} y={44} label={`${frontage} m`} />
      <DimensionArrowVertical y1={52} y2={164} x={44} label={`${depth} m`} />
      <DimensionRail y={186} label={`${property.areaSqm} m²`} />
    </g>
  );
}

/* --- Plan ----------------------------------------------------------------- */

function Plan({ property }: { property: Property }) {
  const seed = property.id;
  const x = 46;
  const y = 34;
  const width = 228;
  const height = 152;
  const rooms = Math.max(1, property.beds);
  const split = width * (0.44 + seededInt(seed, "split", 0, 8) / 100);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="2.5"
      />
      {/* Living side / bedroom side. */}
      <line
        x1={x + split}
        y1={y}
        x2={x + split}
        y2={y + height}
        stroke={INK}
        strokeWidth="2"
      />
      {Array.from({ length: rooms }, (_, index) => (
        <line
          key={index}
          x1={x + split}
          y1={y + ((index + 1) * height) / (rooms + 1)}
          x2={x + width}
          y2={y + ((index + 1) * height) / (rooms + 1)}
          stroke={INK_SOFT}
          strokeWidth="1.5"
        />
      ))}
      {/* Wet block. */}
      <rect
        x={x + 8}
        y={y + height - 52}
        width={split - 20}
        height="44"
        fill={GLASS}
        stroke={INK_SOFT}
        strokeWidth="1.5"
      />
      {/* Door swings on the entrance wall. */}
      <path
        d={`M${x} ${y + height - 30} a30 30 0 0 0 30 -30`}
        fill="none"
        stroke={INK_SOFT}
        strokeWidth="1.25"
      />
      <DimensionArrow x1={x} x2={x + width} y={y - 14} label={`${property.areaSqm} m²`} />
    </g>
  );
}

/* --- Plot ----------------------------------------------------------------- */

function Plot({ property }: { property: Property }) {
  const seed = property.id;
  const offset = seededInt(seed, "plot", -10, 10);

  return (
    <g>
      {/* Streets. */}
      <rect x="0" y="150" width="320" height="30" fill={INK_FAINT} />
      <rect x="242" y="0" width="26" height="220" fill={INK_FAINT} />
      <line x1="0" y1="165" x2="320" y2="165" stroke={INK_SOFT} strokeWidth="1" strokeDasharray="10 8" />
      <line x1="255" y1="0" x2="255" y2="220" stroke={INK_SOFT} strokeWidth="1" strokeDasharray="10 8" />

      {/* Neighbouring plots, so the unit reads as part of a block. */}
      {Array.from({ length: 3 }, (_, index) => (
        <rect
          key={index}
          x={18 + index * 74}
          y="42"
          width="62"
          height="94"
          fill="none"
          stroke={INK_FAINT}
          strokeWidth="1.5"
        />
      ))}

      {/* This unit. */}
      <rect
        x={92 + offset}
        y="38"
        width="70"
        height="102"
        fill="var(--plate-wall)"
        stroke={INK}
        strokeWidth="2.5"
      />
      <rect
        x={100 + offset}
        y="52"
        width="54"
        height="62"
        fill={GLASS}
        stroke={INK}
        strokeWidth="1.5"
      />
      <circle cx={127 + offset} cy="146" r="5" fill={INK} />
      <DimensionRail y="200" label={`${property.areaSqm} m²`} />
    </g>
  );
}

/* --- Section -------------------------------------------------------------- */

function Section({ property }: { property: Property }) {
  const storeys =
    property.type === "villa" ? 2 : Math.max(3, Math.min(6, (property.floor ?? 2) + 2));
  const unitFloor = property.floor ?? 0;
  const slabHeight = 130 / storeys;
  const base = 176;

  return (
    <g>
      <GroundLine y={base} />
      {Array.from({ length: storeys }, (_, index) => {
        const level = storeys - 1 - index; // 0 = ground
        const y = base - (index + 1) * slabHeight;
        const isUnit = level === unitFloor;

        return (
          <g key={index}>
            <rect
              x="62"
              y={y}
              width="196"
              height={slabHeight}
              fill={isUnit ? GLASS : "var(--plate-wall)"}
              stroke={isUnit ? INK : INK_SOFT}
              strokeWidth={isUnit ? 2.25 : 1.25}
            />
            <line
              x1="62"
              y1={y + slabHeight}
              x2="258"
              y2={y + slabHeight}
              stroke={INK}
              strokeWidth="2.5"
            />
          </g>
        );
      })}
      <DimensionArrowVertical
        y1={base - storeys * slabHeight}
        y2={base}
        x={44}
        label={`${storeys}`}
      />
      <DimensionRail y={base + 20} label={`${property.areaSqm} m²`} />
    </g>
  );
}

/* --- Drawing furniture ---------------------------------------------------- */

function GroundLine({ y }: { y: number }) {
  return (
    <g>
      <line x1="0" y1={y} x2="320" y2={y} stroke={INK} strokeWidth="2" />
      {Array.from({ length: 22 }, (_, index) => (
        <line
          key={index}
          x1={index * 15}
          y1={y}
          x2={index * 15 - 8}
          y2={y + 8}
          stroke={INK_SOFT}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

/** A single palm in outline — north Riyadh's one reliable street tree. */
function SidePalm({
  x,
  ground,
  seed,
}: {
  x: number;
  ground: number;
  seed: string;
}) {
  const height = seededInt(seed, "palm", 44, 66);
  const top = ground - height;

  return (
    <g stroke={INK_SOFT} strokeWidth="1.5" fill="none">
      <line x1={x} y1={ground} x2={x} y2={top} />
      {[-1, 1].map((direction) =>
        [0, 1, 2].map((index) => (
          <path
            key={`${direction}-${index}`}
            d={`M${x} ${top + index * 5} q${direction * 16} ${-6 + index * 5} ${direction * 22} ${6 + index * 6}`}
          />
        )),
      )}
    </g>
  );
}

function DimensionRail({ y, label }: { y: number | string; label: string }) {
  const yy = Number(y);
  return (
    <g>
      <line x1="34" y1={yy} x2="286" y2={yy} stroke={INK_SOFT} strokeWidth="1" />
      <line x1="34" y1={yy - 4} x2="34" y2={yy + 4} stroke={INK_SOFT} strokeWidth="1" />
      <line x1="286" y1={yy - 4} x2="286" y2={yy + 4} stroke={INK_SOFT} strokeWidth="1" />
      <text
        x="160"
        y={yy - 6}
        textAnchor="middle"
        fill={INK}
        fontSize="12"
        fontFamily="var(--gz-family-mono)"
        direction="ltr"
      >
        {label}
      </text>
    </g>
  );
}

function DimensionArrow({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
}) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={INK_SOFT} strokeWidth="1" />
      <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke={INK_SOFT} strokeWidth="1" />
      <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} stroke={INK_SOFT} strokeWidth="1" />
      <text
        x={(x1 + x2) / 2}
        y={y - 7}
        textAnchor="middle"
        fill={INK}
        fontSize="12"
        fontFamily="var(--gz-family-mono)"
        direction="ltr"
      >
        {label}
      </text>
    </g>
  );
}

function DimensionArrowVertical({
  y1,
  y2,
  x,
  label,
}: {
  y1: number;
  y2: number;
  x: number;
  label: string;
}) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={INK_SOFT} strokeWidth="1" />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} stroke={INK_SOFT} strokeWidth="1" />
      <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} stroke={INK_SOFT} strokeWidth="1" />
      <text
        x={x - 8}
        y={(y1 + y2) / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fill={INK}
        fontSize="12"
        fontFamily="var(--gz-family-mono)"
        direction="ltr"
      >
        {label}
      </text>
    </g>
  );
}
