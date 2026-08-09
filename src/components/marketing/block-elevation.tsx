/**
 * The hero drawing: one north-Riyadh street in elevation.
 *
 * Low-rise apartment blocks, two villas behind their boundary walls, a corner
 * shop and a plot still waiting — which is what these districts actually look
 * like. Drawn in the same ink and paper as the property plates so the home page
 * and the listings read as one document. No photography, no glass towers.
 */
const INK = "var(--gz-petrol-800)";
const INK_SOFT = "color-mix(in srgb, var(--gz-petrol-800) 40%, transparent)";
const INK_FAINT = "color-mix(in srgb, var(--gz-petrol-800) 16%, transparent)";
const GLASS = "color-mix(in srgb, var(--gz-petrol-500) 22%, transparent)";
const WALL = "var(--gz-limestone-100)";

const GROUND = 236;

export function BlockElevation({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 280"
      role="img"
      aria-label=""
      aria-hidden
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Sheet grid. */}
      <g stroke={INK_FAINT} strokeWidth="0.6">
        {Array.from({ length: 31 }, (_, index) => (
          <line key={`v${index}`} x1={index * 20 + 20} y1="0" x2={index * 20 + 20} y2="280" />
        ))}
        {Array.from({ length: 13 }, (_, index) => (
          <line key={`h${index}`} x1="0" y1={index * 20 + 20} x2="640" y2={index * 20 + 20} />
        ))}
      </g>

      {/* --- Apartment block, four storeys ------------------------------- */}
      <Block x={26} width={132} storeys={4} storeyHeight={30} columns={4} balconyRow={1} />

      {/* --- Villa behind its wall --------------------------------------- */}
      <Villa x={176} width={132} />

      {/* --- The plot that has not been built on yet ---------------------- */}
      <g>
        <rect
          x="326"
          y={GROUND - 42}
          width="86"
          height="42"
          fill="none"
          stroke={INK_SOFT}
          strokeWidth="1.5"
          strokeDasharray="7 5"
        />
        <text
          x="369"
          y={GROUND - 16}
          textAnchor="middle"
          fill={INK_SOFT}
          fontSize="13"
          fontFamily="var(--gz-family-mono)"
          direction="ltr"
        >
          600 m²
        </text>
      </g>

      {/* --- Apartment block, five storeys -------------------------------- */}
      <Block x={430} width={110} storeys={5} storeyHeight={28} columns={3} balconyRow={2} />

      {/* --- Corner shop --------------------------------------------------- */}
      <g>
        <rect
          x="556"
          y={GROUND - 66}
          width="72"
          height="66"
          fill={WALL}
          stroke={INK}
          strokeWidth="1.75"
        />
        <rect x="556" y={GROUND - 66} width="72" height="16" fill={INK_SOFT} stroke={INK} strokeWidth="1.5" />
        <rect x="564" y={GROUND - 42} width="56" height="34" fill={GLASS} stroke={INK} strokeWidth="1.5" />
        <line x1="592" y1={GROUND - 42} x2="592" y2={GROUND - 8} stroke={INK} strokeWidth="1.25" />
      </g>

      <Palm x={318} height={68} />
      <Palm x={420} height={54} />

      {/* Ground, with the hatch that says "this is a section through soil". */}
      <line x1="0" y1={GROUND} x2="640" y2={GROUND} stroke={INK} strokeWidth="2.25" />
      <g stroke={INK_SOFT} strokeWidth="1">
        {Array.from({ length: 44 }, (_, index) => (
          <line
            key={index}
            x1={index * 15}
            y1={GROUND}
            x2={index * 15 - 10}
            y2={GROUND + 10}
          />
        ))}
      </g>

      {/* The measured street width — the drawing's one annotation. */}
      <g>
        <line x1="26" y1={GROUND + 28} x2="628" y2={GROUND + 28} stroke={INK_SOFT} strokeWidth="1" />
        <line x1="26" y1={GROUND + 23} x2="26" y2={GROUND + 33} stroke={INK_SOFT} strokeWidth="1" />
        <line x1="628" y1={GROUND + 23} x2="628" y2={GROUND + 33} stroke={INK_SOFT} strokeWidth="1" />
      </g>
    </svg>
  );
}

function Block({
  x,
  width,
  storeys,
  storeyHeight,
  columns,
  balconyRow,
}: {
  x: number;
  width: number;
  storeys: number;
  storeyHeight: number;
  columns: number;
  balconyRow: number;
}) {
  const height = storeys * storeyHeight;
  const top = GROUND - height;
  const cellWidth = width / columns;

  return (
    <g>
      <rect x={x} y={top} width={width} height={height} fill={WALL} stroke={INK} strokeWidth="1.75" />
      <rect x={x - 6} y={top - 8} width={width + 12} height="8" fill={WALL} stroke={INK} strokeWidth="1.75" />

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

      {Array.from({ length: storeys }, (_, row) =>
        Array.from({ length: columns }, (_, column) => {
          const isDoor = row === storeys - 1 && column === Math.floor(columns / 2);
          const wx = x + column * cellWidth + cellWidth * 0.26;
          const ww = cellWidth * 0.48;

          return isDoor ? (
            <rect
              key={`${row}-${column}`}
              x={wx}
              y={top + row * storeyHeight + storeyHeight * 0.32}
              width={ww}
              height={storeyHeight * 0.68}
              fill={GLASS}
              stroke={INK}
              strokeWidth="1.25"
            />
          ) : (
            <rect
              key={`${row}-${column}`}
              x={wx}
              y={top + row * storeyHeight + storeyHeight * 0.26}
              width={ww}
              height={storeyHeight * 0.44}
              fill={GLASS}
              stroke={INK_SOFT}
              strokeWidth="1.25"
            />
          );
        }),
      )}

      <line
        x1={x + 6}
        y1={top + balconyRow * storeyHeight}
        x2={x + width - 6}
        y2={top + balconyRow * storeyHeight}
        stroke={INK}
        strokeWidth="3"
      />
    </g>
  );
}

function Villa({ x, width }: { x: number; width: number }) {
  const height = 96;
  const top = GROUND - height;

  return (
    <g>
      <rect x={x} y={top} width={width} height={height} fill={WALL} stroke={INK} strokeWidth="1.75" />
      <rect x={x - 8} y={top - 9} width={width + 16} height="9" fill={WALL} stroke={INK} strokeWidth="1.75" />
      <line x1={x} y1={top + 48} x2={x + width} y2={top + 48} stroke={INK_SOFT} strokeWidth="1" />

      {[0, 1].map((row) =>
        [0, 1, 2].map((column) => (
          <rect
            key={`${row}-${column}`}
            x={x + 14 + column * 38}
            y={top + 14 + row * 48}
            width="24"
            height="24"
            fill={GLASS}
            stroke={INK_SOFT}
            strokeWidth="1.25"
          />
        )),
      )}

      {/* The boundary wall and gate in front. */}
      <rect x={x - 12} y={GROUND - 32} width={width + 24} height="32" fill={WALL} stroke={INK} strokeWidth="1.75" />
      <rect x={x + width / 2 - 24} y={GROUND - 28} width="48" height="28" fill={GLASS} stroke={INK} strokeWidth="1.5" />
      {Array.from({ length: 6 }, (_, index) => (
        <line
          key={index}
          x1={x + width / 2 - 18 + index * 7}
          y1={GROUND - 25}
          x2={x + width / 2 - 18 + index * 7}
          y2={GROUND - 3}
          stroke={INK_SOFT}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function Palm({ x, height }: { x: number; height: number }) {
  const top = GROUND - height;
  return (
    <g stroke={INK_SOFT} strokeWidth="1.5" fill="none">
      <line x1={x} y1={GROUND} x2={x} y2={top} />
      {[-1, 1].map((direction) =>
        [0, 1, 2].map((index) => (
          <path
            key={`${direction}-${index}`}
            d={`M${x} ${top + index * 6} q${direction * 18} ${-7 + index * 6} ${direction * 26} ${7 + index * 7}`}
          />
        )),
      )}
    </g>
  );
}
