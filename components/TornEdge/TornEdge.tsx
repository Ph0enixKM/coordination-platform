import styles from "./TornEdge.module.css";

/**
 * The torn paper from the corner of the Podcast PNO cover: a sheet of the
 * page's background with a ragged grey rim, rising towards the right. Set at
 * the bottom of a dark section, it tears that section open into the one below.
 *
 * The edge is drawn once, from a seeded random sequence, so it comes out the
 * same on the server and in every browser.
 */

const WIDTH = 1440;
const HEIGHT = 110;
const STEP = 5;

/** Mulberry32: a small seeded generator, the same numbers on every run. */
function random(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(from: number, to: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));

  return t * t * (3 - 2 * t);
}

/** How high the tear stands at x: low on the left, a hill towards the right. */
function ridge(x: number) {
  const t = x / WIDTH;

  return (
    HEIGHT -
    14 -
    74 * smoothstep(0.45, 0.98, t) -
    6 * Math.sin(t * 19) -
    4 * Math.sin(t * 47 + 1.3)
  );
}

/** The tear's outline, `lift` px above the ridge, roughened by `rough` px. */
function edge(seed: number, lift: number, rough: number) {
  const next = random(seed);
  const points: string[] = [];

  for (let x = 0; x <= WIDTH; x += STEP) {
    // Mostly a fine fray, now and then a deeper notch, as torn paper has.
    const notch = next() < 0.08 ? next() * rough * 2.2 : 0;
    const y = ridge(x) - lift + (next() - 0.5) * rough + notch;

    points.push(`${x} ${y.toFixed(1)}`);
  }

  return `M0 ${HEIGHT} L${points.join(" L")} L${WIDTH} ${HEIGHT} Z`;
}

const RIM = edge(7, 11, 6);
const SHEET = edge(23, 0, 3.5);

export default function TornEdge() {
  return (
    <svg
      className={styles.edge}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.rim} d={RIM} />
      <path className={styles.sheet} d={SHEET} />
    </svg>
  );
}
