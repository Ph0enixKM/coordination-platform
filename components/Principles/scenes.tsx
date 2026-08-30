import type { CSSProperties, ReactNode } from "react";
import styles from "./scenes.module.css";

export type SceneProps = { play: boolean };

/**
 * Every scene draws into the same 360×240 frame and runs the same arc as the
 * point beside it: the situation the firm is in first, the difference our way
 * of working makes second.
 *
 * `play` is only true for the slide the carousel is parked on, so at most one
 * of the ten loops is ever burning frames.
 */
function Frame({ play, children }: SceneProps & { children: ReactNode }) {
  return (
    <svg
      className={styles.scene}
      data-play={play ? "true" : undefined}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Custom properties are how a scene feeds per-element values to a keyframe. */
const vars = (values: Record<string, string>) => values as CSSProperties;

/* --- 1. the cause is not always where the symptom is ---------------------- */

/** Four areas of the firm, side by side. The symptom shows up in the last one. */
const AREAS = [10, 98, 186, 274] as const;

export function SymptomScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {AREAS.map((x, index) => (
        <g key={`area-${x}`}>
          <rect className={styles.paper} x={x} y="140" width="76" height="62" rx="14" />
          {/* The two areas that carry a mark keep their insides clear for it. */}
          {index !== 1 && index !== 3 && (
            <path
              className={styles.dim}
              strokeWidth="2"
              d={`M ${x + 18} 165 H ${x + 58} M ${x + 18} 179 H ${x + 46}`}
            />
          )}
        </g>
      ))}

      {/* Where it hurts: the area the client points at. */}
      <g className={styles.symptom}>
        <rect className={styles.symptomRing} x="268" y="134" width="88" height="74" rx="18" />
        <path className={styles.hot} strokeWidth="3" d="M 312 156 V 174 M 312 186 V 186.2" />
      </g>

      {/* Before anything is sold, the trail is followed back to its start. */}
      <path
        className={styles.trace}
        d="M 312 128 C 306 62 190 56 136 122"
        pathLength={1}
      />
      <path className={styles.traceHead} d="M 126 106 L 136 123 L 152 116" />

      {/* And it starts somewhere else entirely. */}
      <g className={styles.cause}>
        <rect className={styles.causeRing} x="92" y="134" width="88" height="74" rx="18" />
        <circle className={styles.causeDot} cx="136" cy="171" r="7" />
      </g>
    </Frame>
  );
}

/* --- 2. one area is never repaired at the cost of another ----------------- */

const NODES = [
  [180, 46],
  [286, 100],
  [246, 188],
  [114, 188],
  [74, 100],
] as const;

type Node = (typeof NODES)[number];

/** The rim carries the impulse; the chords are what make it read as a system. */
const RIM = [
  [4, 0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
] as const;

const CHORDS = [
  [0, 2],
  [0, 3],
  [1, 4],
] as const;

const edge = (a: Node, b: Node) => `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`;

/** The order the impulse visits, starting at the part someone tried to fix. */
const TRAVEL = [4, 0, 1, 2, 3] as const;

export function SystemScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      <g className={styles.dim}>
        {[...RIM, ...CHORDS].map(([a, b]) => (
          <path key={`link-${a}-${b}`} d={edge(NODES[a], NODES[b])} />
        ))}
      </g>

      {/* What looked like one area's gain runs straight through the rest. */}
      {RIM.slice(0, 4).map(([a, b], step) => (
        <path
          key={`signal-${a}-${b}`}
          className={styles.signal}
          d={edge(NODES[a], NODES[b])}
          pathLength={1}
          style={{ animationDelay: `${0.2 + step * 0.62}s` }}
        />
      ))}

      <circle
        className={styles.touched}
        cx={NODES[4][0]}
        cy={NODES[4][1]}
        r={27}
        pathLength={1}
      />

      {TRAVEL.map((index, step) => {
        const [x, y] = NODES[index];
        const delay = `${step * 0.62}s`;

        return (
          <g key={`node-${index}`}>
            <circle className={styles.halo} cx={x} cy={y} r={15} style={{ animationDelay: delay }} />
            <circle className={styles.node} cx={x} cy={y} r={15} />
            <circle
              className={styles.nodeFlash}
              cx={x}
              cy={y}
              r={15}
              style={{ animationDelay: delay }}
            />
            <circle className={styles.nodeCore} cx={x} cy={y} r={5} />
          </g>
        );
      })}
    </Frame>
  );
}

/* --- 3. more is not automatically the answer ------------------------------ */

/** Six things the firm could do more of. Three of them are worth keeping. */
const BARS = [
  { x: 40, height: 46, keep: false },
  { x: 84, height: 62, keep: true },
  { x: 128, height: 38, keep: false },
  { x: 172, height: 72, keep: true },
  { x: 216, height: 44, keep: false },
  { x: 260, height: 58, keep: true },
] as const;

export function MoreScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      <path className={styles.dim} d="M 24 200 H 336" />

      {BARS.map(({ x, height, keep }, index) => (
        <rect
          key={`bar-${x}`}
          className={`${styles.bar} ${keep ? styles.barKeep : styles.barDrop}`}
          x={x}
          y={200 - height}
          width="30"
          height={height}
          rx="5"
          style={{ animationDelay: `${index * 0.16}s` }}
        />
      ))}

      {/* Doing more of everything: the line that matters does not move. */}
      <path className={styles.flatLine} d="M 36 104 H 322" />

      {/* Doing less of the wrong things: the same line finally lifts. */}
      <path
        className={styles.riseLine}
        d="M 36 104 C 130 104 210 88 322 44"
        pathLength={1}
      />
      <path className={styles.riseHead} d="M 310 36 L 322 44 L 313 57" />
    </Frame>
  );
}

/* --- 4. what the contract does to the rest of the firm -------------------- */

/** Where the costs of a badly chosen deal sit inside the keel. */
const MARKS = [
  [134, 150],
  [186, 180],
  [222, 148],
  [152, 208],
] as const;

export function HiddenCostScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* Above the line: clients, revenue, a full calendar. */}
      <rect className={styles.paper} x="122" y="46" width="112" height="66" rx="10" />
      {[0, 1, 2].map((column) =>
        [0, 1].map((row) => (
          <rect
            key={`window-${column}-${row}`}
            className={styles.window}
            x={138 + column * 28}
            y={62 + row * 24}
            width="18"
            height="14"
            rx="3"
          />
        )),
      )}
      <path className={styles.hot} d="M 254 94 V 58 M 244 68 L 254 58 L 264 68" />

      <path
        className={styles.keel}
        d="M 128 112 L 96 158 L 108 202 L 156 228 L 216 216 L 250 172 L 240 112 Z"
      />

      {MARKS.map(([x, y], index) => (
        <g key={`mark-${x}-${y}`} transform={`translate(${x} ${y})`}>
          <g className={styles.mark} style={{ animationDelay: `${index * 0.24}s` }}>
            <circle className={styles.markBadge} r="13" />
            <path className={styles.hot} strokeWidth="2.6" d="M 0 -6 V 1 M 0 7 V 7.2" />
          </g>
        </g>
      ))}

      <g className={styles.water}>
        <path
          className={styles.waterFill}
          d="M -10 112 Q 35 103 80 112 T 170 112 T 260 112 T 370 112 L 370 264 L -10 264 Z"
        />
        <path
          className={styles.waterLine}
          d="M -10 112 Q 35 103 80 112 T 170 112 T 260 112 T 370 112"
        />
      </g>
    </Frame>
  );
}

/* --- 5. one case, then a rule for the next one ---------------------------- */

/** Where each case leaves the rule, and how far behind the one before it. */
const CASES = [
  { exit: 72, delay: 0 },
  { exit: 168, delay: 1.8 },
  { exit: 72, delay: 3.6 },
] as const;

export function RulesScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      <g className={styles.dim} strokeDasharray="7 9">
        <path d="M 8 120 H 138" />
        <path d="M 222 120 H 252" />
        <path d="M 252 120 L 350 72" />
        <path d="M 252 120 L 350 168" />
      </g>

      {/* Written once, out of one real case, the rule keeps sorting the rest. */}
      <rect className={styles.gate} x="138" y="64" width="84" height="112" rx="14" />
      <path className={styles.gateRule} d="M 158 96 H 202" pathLength={1} />
      <path
        className={styles.gateRule}
        d="M 158 120 H 202"
        pathLength={1}
        style={{ animationDelay: "0.18s" }}
      />
      <path
        className={styles.gateRule}
        d="M 158 144 H 188"
        pathLength={1}
        style={{ animationDelay: "0.36s" }}
      />

      {CASES.map(({ exit, delay }, index) => (
        <g
          key={`case-${index}`}
          className={styles.chip}
          style={vars({ "--exit": `${exit}px`, animationDelay: `${delay}s` })}
        >
          <rect className={styles.paper} x="-18" y="-13" width="36" height="26" rx="8" />
          <path className={styles.dim} strokeWidth="2" d="M -9 -3 H 9 M -9 4 H 3" />
        </g>
      ))}
    </Frame>
  );
}

/* --- 6. it does not end at the strategy document -------------------------- */

export function DecisionScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* The paperwork stacks up whatever the firm actually does. */}
      {[0, 1, 2].map((index) => (
        <g key={`sheet-${index}`} transform={`translate(${16 + index * 16} ${100 - index * 14})`}>
          <g className={styles.sheet} style={{ animationDelay: `${index * 0.32}s` }}>
            <rect className={styles.paper} width="68" height="90" rx="8" />
            <path
              className={styles.dim}
              strokeWidth="2"
              d="M 15 24 H 53 M 15 40 H 53 M 15 56 H 40"
            />
          </g>
        </g>
      ))}

      <path className={styles.feed} d="M 118 122 H 178" />
      <path className={styles.dim} strokeWidth="2" d="M 170 116 l 7 6 l -7 6" />

      {/* Where the strategy is actually tested: the moment of choosing. */}
      <circle className={styles.pulse} cx="204" cy="118" r="18" />
      <circle className={styles.paper} cx="204" cy="118" r="18" />
      <circle className={styles.inkFill} cx="204" cy="118" r="6" />

      <g className={styles.branch}>
        <path d="M 222 118 C 254 118 262 92 316 80" />
        <path d="M 222 118 C 254 118 262 146 316 160" />
      </g>
      <path
        className={styles.taken}
        d="M 222 118 C 254 118 262 92 316 80"
        pathLength={1}
      />

      <g className={styles.outcome}>
        <circle className={styles.badge} cx="326" cy="76" r="15" />
        <path className={styles.check} d="M 318 76 l 6 7 l 12 -14" />
      </g>
    </Frame>
  );
}

/* --- 7. the firm is never taken over from its owner ----------------------- */

export function OwnerScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* The decision seat: we work right up to its edge and no further. */}
      <circle className={styles.ring} cx="128" cy="128" r="68" pathLength={1} />

      <g className={styles.inkFill}>
        <circle cx="128" cy="112" r="19" />
        <path d="M 94 176 a 34 34 0 0 1 68 0 Z" />
      </g>

      <g className={styles.advisor}>
        <circle cx="292" cy="122" r="14" />
        <path d="M 268 174 a 24 24 0 0 1 48 0" />
      </g>

      <g className={styles.card}>
        <rect x="204" y="70" width="66" height="48" rx="10" />
        <path className={styles.dim} strokeWidth="2" d="M 218 88 H 256 M 218 100 H 246" />
        <rect className={styles.chosen} x="204" y="70" width="66" height="48" rx="10" />
        <path className={styles.check} d="M 216 94 l 9 10 l 18 -21" />
      </g>

      <g className={`${styles.card} ${styles.declined}`} style={{ animationDelay: "0.22s" }}>
        <rect x="204" y="140" width="66" height="48" rx="10" />
        <path className={styles.dim} strokeWidth="2" d="M 218 158 H 256 M 218 170 H 246" />
      </g>
    </Frame>
  );
}

/* --- 8. control is not taken away, it is exercised differently ------------ */

/** Everything runs to the owner in person; these are the points it runs from. */
const OWNER = [104, 120] as const;

const MATTERS = [
  [269, 25],
  [285, 61],
  [293, 100],
  [293, 140],
  [285, 179],
  [269, 215],
] as const;

/** The two that should still reach the owner: the decisions that matter most. */
const KEPT = [2, 3];

const runsTo = (matter: readonly [number, number]) =>
  `M ${OWNER[0]} ${OWNER[1]} L ${matter[0]} ${matter[1]}`;

/** A rule sits across the line, at right angles to it, and settles it there. */
const ruleOn = (matter: readonly [number, number]) => {
  const dx = matter[0] - OWNER[0];
  const dy = matter[1] - OWNER[1];
  const length = Math.hypot(dx, dy);
  const [px, py] = [(-dy / length) * 11, (dx / length) * 11];
  const [cx, cy] = [OWNER[0] + dx * 0.62, OWNER[1] + dy * 0.62];

  return `M ${(cx - px).toFixed(1)} ${(cy - py).toFixed(1)} L ${(cx + px).toFixed(1)} ${(cy + py).toFixed(1)}`;
};

export function ControlScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* Control by watching everything personally. */}
      <g className={styles.stateBusy}>
        {MATTERS.map((matter) => (
          <path key={`busy-${matter[0]}-${matter[1]}`} className={styles.hot} d={runsTo(matter)} />
        ))}
      </g>

      {/* Control by rules, responsibilities and criteria - same control, less traffic. */}
      <g className={styles.stateSorted}>
        {MATTERS.map((matter, index) => (
          <path
            key={`sorted-${matter[0]}-${matter[1]}`}
            className={KEPT.includes(index) ? styles.hot : styles.dim}
            d={runsTo(matter)}
          />
        ))}
        {MATTERS.filter((_, index) => !KEPT.includes(index)).map((matter) => (
          <path key={`rule-${matter[0]}-${matter[1]}`} className={styles.ruleBar} d={ruleOn(matter)} />
        ))}
      </g>

      {MATTERS.map(([x, y]) => (
        <g key={`matter-${x}-${y}`}>
          <rect className={styles.paper} x={x - 20} y={y - 13} width="40" height="26" rx="8" />
          <path className={styles.dim} strokeWidth="2" d={`M ${x - 10} ${y - 3} H ${x + 10} M ${x - 10} ${y + 4} H ${x + 2}`} />
        </g>
      ))}

      <g className={styles.inkFill}>
        <circle cx="72" cy="102" r="19" />
        <path d="M 38 164 a 34 34 0 0 1 68 0 Z" />
      </g>
    </Frame>
  );
}

/* --- 9. a firm that works, but works too hard ----------------------------- */

export function StrainScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      <path className={styles.dim} d="M 12 208 L 348 124" />

      {/* How little ground the last stretch of effort actually covered. */}
      <path className={styles.span} strokeWidth="2" d="M 150 173 l 5 20 M 224 155 l 5 20" />
      <path className={styles.span} strokeWidth="2" d="M 155 193 L 229 175" strokeDasharray="5 6" />

      <g className={styles.hauler}>
        <g transform="translate(150 173) rotate(-14)">
          <rect className={styles.paper} x="-30" y="-46" width="60" height="46" rx="8" />
          <path className={styles.dim} strokeWidth="2" d="M -16 -32 H 16 M -16 -18 H 4" />

          {/* The effort that goes in, out of all proportion to the distance. */}
          <path className={styles.hot} strokeWidth="3" d="M -44 -30 l 10 8 l -10 8" />
          <path className={styles.hot} strokeWidth="3" opacity="0.6" d="M -58 -30 l 10 8 l -10 8" />
          <path className={styles.hot} strokeWidth="3" opacity="0.3" d="M -72 -30 l 10 8 l -10 8" />

          <g className={styles.strain}>
            <path d="M -16 -56 q 6 -9 0 -18" />
            <path d="M 0 -60 q 6 -9 0 -18" />
            <path d="M 16 -56 q 6 -9 0 -18" />
          </g>
        </g>
      </g>
    </Frame>
  );
}

/* --- 10. the strategic direction, checked against the everyday ------------ */

/** Clients, offers, discounts, orders - where a direction is actually settled. */
const EVERYDAY = [26, 108, 190, 272] as const;

export function BridgeScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* Where the firm is heading. */}
      <path className={styles.aim} d="M 30 48 H 316" pathLength={1} />
      <path className={styles.aimHead} d="M 304 38 L 316 48 L 304 58" />

      {EVERYDAY.map((x, index) => (
        <g key={`daily-${x}`}>
          <path
            className={styles.drop}
            d={`M ${x + 31} 62 V 166`}
            pathLength={1}
            style={{ animationDelay: `${index * 0.22}s` }}
          />
          <rect className={styles.paper} x={x} y="168" width="62" height="46" rx="12" />
          <path
            className={styles.dim}
            strokeWidth="2"
            d={`M ${x + 14} 184 H ${x + 48} M ${x + 14} 196 H ${x + 36}`}
          />
          <path
            className={styles.tileCheck}
            d={`M ${x + 20} 191 l 8 9 l 15 -18`}
            style={{ animationDelay: `${index * 0.22}s` }}
          />
        </g>
      ))}
    </Frame>
  );
}
