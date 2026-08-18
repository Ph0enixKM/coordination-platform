import type { CSSProperties, ReactNode } from "react";
import styles from "./scenes.module.css";

export type SceneProps = { play: boolean };

/**
 * Every scene draws into the same 360×240 frame and runs the same arc as the
 * copy beside it: the ból/problem state on screen first, the wartość/rezultat
 * state second.
 *
 * `play` is only true for the slide the carousel is parked on, so at most one
 * of the six loops is ever burning frames.
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

/* --- 1. one system, not separate parts ------------------------------------ */

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

      {/* What looked like one area's problem runs straight through the rest. */}
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

/* --- 2. rules, not another round of tasks --------------------------------- */

/** Where each task leaves the rule, and how far behind the one before it. */
const TASKS = [
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

      {/* Written once, the rule keeps sorting whatever arrives after it. */}
      <rect className={styles.gate} x="138" y="64" width="84" height="112" rx="14" />
      <path className={styles.gateRule} d="M 158 96 H 202" />
      <path
        className={styles.gateRule}
        d="M 158 120 H 202"
        style={{ animationDelay: "-0.6s" }}
      />
      <path
        className={styles.gateRule}
        d="M 158 144 H 188"
        style={{ animationDelay: "-1.2s" }}
      />

      {TASKS.map(({ exit, delay }, index) => (
        <g
          key={`task-${index}`}
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

/* --- 3. the owner keeps the seat ------------------------------------------ */

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

/* --- 4. real decisions, not just documents -------------------------------- */

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

/* --- 5. the costs under the waterline ------------------------------------- */

/** Where the hidden costs sit inside the keel. */
const MARKS = [
  [134, 150],
  [186, 180],
  [222, 148],
  [152, 208],
] as const;

export function HiddenCostScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      {/* Everything above the line: clients, revenue, a full calendar. */}
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

/* --- 6. the loop that stops repeating -------------------------------------- */

export function LoopScene({ play }: SceneProps) {
  return (
    <Frame play={play}>
      <g className={styles.loop}>
        <path d="M 140 66 A 58 58 0 1 1 92 92" />
        <path d="M 80 82 L 91 93 L 104 87" />
      </g>

      {/* Different client, different project, same decision going wrong. */}
      <g className={styles.fault}>
        <circle className={styles.markBadge} cx="140" cy="66" r="16" />
        <path className={styles.hot} d="M 133 59 L 147 73 M 147 59 L 133 73" />
      </g>

      <path
        className={styles.rise}
        d="M 198 118 H 236 V 92 H 274 V 66 H 310"
        pathLength={1}
      />
      <path className={styles.riseHead} d="M 298 56 L 310 66 L 298 76" />
    </Frame>
  );
}
