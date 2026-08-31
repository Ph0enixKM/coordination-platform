import { useEffect, useState } from "react";
import styles from "./DiagnosisScene.module.css";

/**
 * Point 1: the firm shows us the one thing that visibly does not work. Before
 * anything is sold, we look closer - and the same field turns out to have more
 * lit up in it than the one cell anybody was pointing at.
 *
 * The grid runs edge to edge and is faded back into the board by an elliptical
 * mask, so the field reads as a fragment of something larger rather than as a
 * diagram with borders.
 */

const COLS = 12;
const ROWS = 8;
/** Cell pitch, cell size, and the margin that falls out of the two. */
const PITCH = 30;
const CELL = 22;
const INSET = (PITCH - CELL) / 2;

const LENS = { x: 195, y: 105, r: 88 } as const;

/** Barely a magnification - just enough that the eye reads it as one. */
const ZOOM = 1.25;

/** The cell the client points at. It sits under the middle of the lens. */
const SYMPTOM = [6, 3] as const;

type Coords = readonly [number, number];

/**
 * Everything the second look could turn up: the eight cells touching the one
 * the client points at, diagonals included. Whatever is lit is always right
 * next to the symptom - the point is that the trouble does not stay inside the
 * one cell anybody was looking at.
 */
const NEIGHBOURS: Coords[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
].map(([dx, dy]) => [SYMPTOM[0] + dx, SYMPTOM[1] + dy] as Coords);

/** How many of them light up on any one pass. */
const FOUND = { min: 2, max: 3 } as const;

/**
 * The first render has to match the one the server sent, so the field starts
 * on a fixed pattern and only starts drawing its own once it is mounted.
 */
const FIRST_LOOK: Coords[] = [
  [7, 2],
  [7, 4],
  [5, 3],
];

/**
 * What was lit the whole time. These are drawn inside the glass and nowhere
 * else, so each one appears exactly when the glass reaches it - no timing of
 * their own, no reveal that could fall out of step with the travel.
 */
function pickHidden(): Coords[] {
  const pool = [...NEIGHBOURS];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const count = FOUND.min + Math.floor(Math.random() * (FOUND.max - FOUND.min + 1));

  return pool.slice(0, count);
}

const CELLS: Coords[] = Array.from({ length: COLS * ROWS }, (_, index) => [
  index % COLS,
  Math.floor(index / COLS),
]);

const center = ([col, row]: Coords) => [
  col * PITCH + PITCH / 2,
  row * PITCH + PITCH / 2,
];

function Cell({ cell, className }: { cell: Coords; className: string }) {
  const [col, row] = cell;

  return (
    <rect
      className={className}
      x={col * PITCH + INSET}
      y={row * PITCH + INSET}
      width={CELL}
      height={CELL}
      rx="6"
    />
  );
}

function Lit({ cell }: { cell: Coords }) {
  const [x, y] = center(cell);

  return (
    <g>
      <circle className={styles.halo} cx={x} cy={y} r="27" fill="url(#coordination-glow)" />
      <Cell cell={cell} className={styles.litCell} />
    </g>
  );
}

export default function DiagnosisScene({ play }: { play: boolean }) {
  const [hidden, setHidden] = useState<Coords[]>(FIRST_LOOK);

  // A fresh pattern once on the client, and then one per pass of the glass -
  // the loop ends with it off-screen, so the swap is never visible.
  useEffect(() => {
    setHidden(pickHidden());
  }, []);

  return (
    <svg
      className={styles.scene}
      data-play={play ? "true" : undefined}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The field has no edge of its own; it just runs out into the board. */}
        <radialGradient id="coordination-fade" cx="50%" cy="50%" r="62%">
          <stop className={styles.fadeIn} offset="38%" />
          <stop className={styles.fadeOut} offset="100%" />
        </radialGradient>

        <mask id="coordination-vignette">
          <rect width="360" height="240" fill="url(#coordination-fade)" />
        </mask>

        <radialGradient id="coordination-glow">
          <stop className={styles.glowCore} offset="0%" />
          <stop className={styles.glowEdge} offset="100%" />
        </radialGradient>

        <clipPath id="coordination-lens">
          <circle cx={LENS.x} cy={LENS.y} r={LENS.r} />
        </clipPath>

        <filter id="coordination-lift" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#012141" floodOpacity="0.16" />
        </filter>
      </defs>

      <g mask="url(#coordination-vignette)">
        {CELLS.map((cell) => (
          <Cell key={`cell-${cell[0]}-${cell[1]}`} cell={cell} className={styles.cell} />
        ))}

        {/* The one thing everybody can already see. */}
        <Lit cell={SYMPTOM} />
      </g>

      <g
        className={styles.lens}
        // The halos inside the glass keep their own beat and bubble up here,
        // so only the travel of the glass itself is allowed to redraw.
        onAnimationIteration={(event) => {
          if (event.target === event.currentTarget) setHidden(pickHidden());
        }}
      >
        {/* Drawn first so the glass sits on top of where it is held. */}
        <path className={styles.handle} d="M 250 160 L 302 212" />

        <circle
          className={styles.glass}
          cx={LENS.x}
          cy={LENS.y}
          r={LENS.r}
          filter="url(#coordination-lift)"
        />

        <g clipPath="url(#coordination-lens)">
          {/*
           * The glass travels, but what it shows belongs to the field, not to
           * the glass: this group runs the travel backwards, so the magnified
           * cells stay over the ones they magnify the whole way across.
           */}
          <g className={styles.world}>
            <g transform={`translate(${LENS.x * (1 - ZOOM)} ${LENS.y * (1 - ZOOM)}) scale(${ZOOM})`}>
              {CELLS.map((cell) => (
                <Cell key={`near-${cell[0]}-${cell[1]}`} cell={cell} className={styles.cell} />
              ))}

              <Lit cell={SYMPTOM} />

              {hidden.map((cell) => (
                <Lit key={`found-${cell[0]}-${cell[1]}`} cell={cell} />
              ))}
            </g>
          </g>
        </g>

        <circle className={styles.rim} cx={LENS.x} cy={LENS.y} r={LENS.r} />
        <path className={styles.shine} d="M 132.8 61.4 A 76 76 0 0 1 169 33.6" />
      </g>
    </svg>
  );
}
