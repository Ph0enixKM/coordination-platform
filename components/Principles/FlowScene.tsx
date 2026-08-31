"use client";

import { useEffect, useRef } from "react";
import styles from "./FlowScene.module.css";

/**
 * Point 2: a fragment of the firm's flow, two steps of it, with the rest
 * running off both edges of the board. The handover in the middle is the one
 * that costs - it is the only thing drawn in the accent, and the loop is it
 * being pulled straight. Then the whole fragment drops out and the next one
 * falls in, tangled again in a different way: the same work, the next handover.
 *
 * The straightening is a path morph, and a path morph is the one thing CSS
 * cannot be trusted with across browsers - the `d` property only landed in
 * Safari 17.4. So the whole loop is SMIL instead, which every engine has had
 * for years, and the slide that is not on screen has its timeline paused.
 */

type Point = readonly [number, number];
type Curve = readonly [Point, Point, Point];

/** Where the link leaves the first step, and the middle of the run to the next. */
const START: Point = [131, 120];
const MIDDLE: Point = [180, 120];

/** The three ways the line travels between the two steps. */
const UP: Point = [0, -1];
const DOWN: Point = [0, 1];
const RIGHT: Point = [1, 0];

const at = ([x, y]: Point) => `${x} ${y}`;
const curve = (c1: Point, c2: Point, to: Point) => `C ${at(c1)}, ${at(c2)}, ${at(to)}`;
const step = ([x, y]: Point, [dx, dy]: Point, by: number): Point => [x + dx * by, y + dy * by];

/** Half a turn about the middle of the run: what makes a tangle its own other half. */
const turn = ([x, y]: Point): Point => [2 * MIDDLE[0] - x, 2 * MIDDLE[1] - y];

/**
 * The shape of a loop at a corner: how far short of it the loop begins, how far
 * past it the line carries on, and how far to the side and behind the
 * corner it comes back at the turn.
 */
const LEAD = 8;
const REACH = 34;
const SWING = 28;
const BEHIND = 10;

/** Where the line has to be for the loop at a corner to pick it up. */
const before = (corner: Point, into: Point) => step(corner, into, -LEAD);

/**
 * A loop at a corner: the line carries on past the turn it should have made,
 * comes back at it from behind and to the side, and crosses itself on the way
 * through. One curve, like every other segment here.
 */
const curl = (corner: Point, into: Point, along: Point): Curve => [
  step(corner, into, REACH),
  step(step(corner, along, -SWING), into, -BEHIND),
  step(corner, along, LEAD),
];

/**
 * A tangle that is its own other half. Only the way out from the first step is
 * given - four curves, and a fifth that crosses the middle with its two handles
 * a pair, so it is symmetric on its own. The way back is those four again,
 * reversed and turned half around, which is what makes the two sides match
 * exactly rather than nearly. Nine curves either way, same as the tangles drawn
 * by hand.
 */
function symmetric(out: readonly Curve[], bridge: Point): string {
  const anchors = [START, ...out.map(([, , to]) => to)];
  const parts = [`M ${at(START)}`];

  out.forEach(([c1, c2, to]) => parts.push(curve(c1, c2, to)));

  parts.push(curve(bridge, turn(bridge), turn(anchors[out.length])));

  for (let i = out.length - 1; i >= 0; i -= 1) {
    const [c1, c2] = out[i];
    parts.push(curve(turn(c2), turn(c1), turn(anchors[i])));
  }

  return parts.join(" ");
}

/** The corners the clover turns at; the other two are these two turned around. */
const TOP_LEFT: Point = [150, 74];
const TOP_RIGHT: Point = [180, 74];

/*
 * The three ways the handover runs: tall narrow excursions rather than gentle
 * waves. The first is drawn by hand and is not symmetric; the other two are
 * built out of one half and its own half turn, so they come out even. They are
 * all written command for command alike, so any one of them can be interpolated
 * into the straight line, and so a pass can hand the link over to the next
 * tangle without the morph noticing.
 */
const TANGLES = [
  [
    "M 131 120 ",
    "C 141.3 120 146.5 121 150.8 116 ",
    "C 156.8 108 153.4 70 161.9 62 ",
    "C 168.8 55 176.6 62 177.4 80 ",
    "C 179.1 108 173 164 187 173 ",
    "C 199 180 206 165 205.8 150 ",
    "C 205.8 140 206.6 132 206.6 124 ",
    "C 207.5 100 209 64 199 60 ",
    "C 185 56 185 93 189 107 ",
    "C 195 122 209.2 120 229 120",
  ].join(" "),

  /*
   * The clover: up out of the first step, a loop at every corner it turns, and
   * one long drop through the middle from the top of the run to the bottom.
   */
  [
    "M 131 120 ",
    "C 150 120 150 100 150 90 ",
    "C 150 55 114 90 150 90 ",
    "C 162 90 165 90 180 90 ",
    "C 215 90 180 55 180 90 ",
    "C 180 102 180 133 180 150 ",
    "C 180 186 145 150 180 150 ",
    "C 193 150 197 150 210 150 ",
    "C 245 150 210 185 210 150 ",
    "C 210 116 217 120 229 120",
  ].join(" "),

  /*
   * The wave: it runs flat out of the first step, lifts into five half waves of
   * the same width and height, and settles back onto the line for the next one.
   */
  [
    "M 131 120 ",
    "C 134 120 136 120 138 120 ",
    "C 141 120 140 110 145 110 ",
    "C 150 110 154 140 159 140 ",
    "C 164 140 168 100 173 100 ",
    "C 178 100 182 140 187 140 ",
    "C 192 140 196 100 201 100 ",
    "C 206 100 205 125 211 125 ",
    "C 216 125 213 120 222 120 ",
    "C 224 120 226 120 229 120",
    ].join(" ")
];

/** Same command for command, so the one can be interpolated into the other. */
const STRAIGHT = [
  "M 131 120",
  "C 134.6 120, 138.3 120, 141.9 120",
  "C 145.5 120, 149.1 120, 152.8 120",
  "C 156.4 120, 160 120, 163.7 120",
  "C 167.3 120, 170.9 120, 174.6 120",
  "C 178.2 120, 181.8 120, 185.4 120",
  "C 189.1 120, 192.7 120, 196.3 120",
  "C 200 120, 203.6 120, 207.2 120",
  "C 210.9 120, 214.5 120, 218.1 120",
  "C 221.7 120, 225.4 120, 229 120",
].join(" ");

/** The two ends of the link's colour: --orange, and the grey of the rest. */
const HOT = "#f2792d";
const COOL = "#c3d0de";

/** One handover, and the clock that runs every tangle in turn before wrapping. */
const PASS = 7.8;
const CLOCK = `${(PASS * TANGLES.length).toFixed(1)}s`;

const HOLD = "0 0 1 1";
const EASE = "0.4 0 0.2 1";

/*
 * One pass: it holds tangled, straightens out, holds straight, and swaps to the
 * next tangle while the fragment is off the bottom of the frame.
 */
const PASS_TIMES = [0, 0.12, 0.48, 0.9, 0.9001, 1];
const PASS_SPLINES = [HOLD, EASE, HOLD, HOLD, HOLD];

/** The drop out of the frame and the fall back in, on the same pass. */
const DROP_TIMES = [0, 0.84, 0.9, 0.9001, 1];
const DROP_SPLINES = [HOLD, "0.55 0 0.85 0.25", HOLD, "0.22 1 0.36 1"];

/**
 * Every animation in the scene is written as a single pass and then laid onto
 * the long clock, once per tangle. The last frame of a pass is dropped, because
 * the next pass opens on that same value and two key times at one instant is
 * the thing SMIL will not take.
 */
function sequence(
  times: readonly number[],
  splines: readonly string[],
  frames: (pass: number) => readonly string[],
) {
  const keyTimes: string[] = [];
  const values: string[] = [];
  const keySplines: string[] = [];

  TANGLES.forEach((_, pass) => {
    const frame = frames(pass);

    for (let step = 0; step < times.length - 1; step += 1) {
      keyTimes.push(String((pass + times[step]) / TANGLES.length));
      values.push(frame[step]);
    }

    keySplines.push(...splines);
  });

  // The clock closes on what the first pass opens with, so the wrap is only
  // one more handover.
  keyTimes.push("1");
  values.push(frames(0)[0]);

  return {
    dur: CLOCK,
    repeatCount: "indefinite",
    calcMode: "spline" as const,
    keyTimes: keyTimes.join(";"),
    keySplines: keySplines.join(";"),
    values: values.join(";"),
  };
}

/** The straightening, and then the handover to the tangle that falls in next. */
const MORPH = sequence(PASS_TIMES, PASS_SPLINES, (pass) => {
  const here = TANGLES[pass];
  const next = TANGLES[(pass + 1) % TANGLES.length];

  return [here, here, STRAIGHT, STRAIGHT, next, next];
});

/** The accent leaving the link as it is pulled straight, and coming back. */
const HEAT = sequence(PASS_TIMES, PASS_SPLINES, () => [HOT, HOT, COOL, COOL, HOT, HOT]);

const DROP = sequence(DROP_TIMES, DROP_SPLINES, () => [
  "0 0",
  "0 0",
  "0 170",
  "0 -170",
  "0 0",
]);

/** A step of the flow: a white card with what happens in it. */
function Step({ x, lines }: { x: number; lines: readonly string[] }) {
  const middle = x + 36;
  /** One line sits on the centre; two straddle it. */
  const first = 120 - (lines.length - 1) * 8;

  return (
    <g>
      <rect className={styles.step} x={x} y="92" width="72" height="56" rx="12" />

      {lines.map((line, index) => (
        <text key={line} className={styles.label} x={middle} y={first + index * 16}>
          {line}
        </text>
      ))}
    </g>
  );
}

export default function FlowScene({ play }: { play: boolean }) {
  const frame = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = frame.current;

    if (!svg) return;

    const still =
      !play || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (still) {
      // Parked at the top of the loop, which is the first tangled handover: the
      // situation the point is about, and a finished picture on its own.
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    } else {
      svg.setCurrentTime(0);
      svg.unpauseAnimations();
    }
  }, [play]);

  return (
    <svg
      ref={frame}
      className={styles.scene}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The flow has no ends of its own; it just runs out into the board. */}
        <linearGradient id="flow-fade" gradientUnits="userSpaceOnUse" x1="0" x2="360">
          <stop className={styles.fadeOut} offset="0%" />
          <stop className={styles.fadeIn} offset="12%" />
          <stop className={styles.fadeIn} offset="88%" />
          <stop className={styles.fadeOut} offset="100%" />
        </linearGradient>

        <mask id="flow-vignette">
          <rect width="360" height="240" fill="url(#flow-fade)" />
        </mask>
      </defs>

      {/* The mask stays with the board, so the fragment fades as it drops. */}
      <g mask="url(#flow-vignette)">
        <g>
          {/*
           * The fragment drops out of the frame and the next handover falls in
           * from above - tangled again, and tangled differently, because the
           * link has already been handed the next shape by the time anyone can
           * see it.
           */}
          <animateTransform attributeName="transform" type="translate" {...DROP} />

          {/* Everything upstream of the fragment, and everything after it. */}
          <path className={styles.line} d="M 4 120 H 44" />
          <path className={styles.line} d="M 37 113 L 44 120 L 37 127" />

          <Step x={51} lines={["Produkcja"]} />

          <path className={styles.link} d={TANGLES[0]} stroke={HOT}>
            <animate attributeName="d" {...MORPH} />
            <animate attributeName="stroke" {...HEAT} />
          </path>

          <path className={styles.link} d="M 222 113 L 229 120 L 222 127" stroke={HOT}>
            <animate attributeName="stroke" {...HEAT} />
          </path>

          <Step x={237} lines={["Kontrola", "jakości"]} />

          <path className={styles.line} d="M 316 120 H 352" />
          <path className={styles.line} d="M 345 113 L 352 120 L 345 127" />
        </g>
      </g>
    </svg>
  );
}
