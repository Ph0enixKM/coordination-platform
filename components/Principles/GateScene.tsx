"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./GateScene.module.css";

/**
 * Point 5: one case comes down the line and reaches the point where somebody
 * has to decide. The gate takes it, holds it long enough to be a decision
 * rather than a reflex, and sends it one way or the other.
 *
 * Which way is drawn again on every turn, because the case is never the point
 * - what the firm is left with is the gate.
 *
 * The travel is SMIL: motion along a path is what it has always been for, and
 * it keeps the gate's colour on the same clock as the case that lights it.
 */

const CYCLE = "7.2s";

/** Off the frame at both ends, so the case is never parked in view. */
const ROUTES = {
  up: "M -16 120 H 186 C 224 120, 240 66, 372 66",
  down: "M -16 120 H 186 C 224 120, 240 174, 372 174",
} as const;

type Branch = keyof typeof ROUTES;

const BRANCHES = Object.keys(ROUTES) as Branch[];

/**
 * Where along the route the gate stands, measured off the same curve - the
 * case slows down between these two, which is the whole point of the drawing.
 */
const REACHES = 0.326;
const LEAVES = 0.506;

/*
 * The extra beats around the gate give the case some weight: it brakes before
 * contact, moves deliberately while hidden, and accelerates once released.
 */
const KEY_TIMES = "0;0.21;0.24;0.44;0.5;0.72;1";
const KEY_POINTS = `0;0.305;${REACHES};${LEAVES};0.56;1;1`;
const KEY_SPLINES = [
  "0 0 1 1",
  "0 0 0.58 1",
  "0.45 0 0.55 1",
  "0.42 0 1 1",
  "0 0 1 1",
  "0 0 1 1",
].join(";");

/*
 * Grey until the case is in it, and grey again the moment it has gone: the
 * response starts at contact, reaches full colour once the case is inside,
 * then leaves a short afterglow as the case accelerates away.
 */
const PAPER = "#ffffff";
const COOL = "#c3d0de";
const HOT = "#f2792d";
const INK = "#8fa3b8";
const LIT_TIMES = "0;0.2;0.25;0.42;0.5;1";
const LIT_SPLINES = Array(5).fill("0.4 0 0.2 1").join(";");

/* A restrained horizontal recoil at impact and a lighter release on exit. */
const JIGGLE_TIMES = "0;0.215;0.24;0.27;0.305;0.435;0.46;0.485;0.525;1";
const JIGGLE_SPLINES = Array(9).fill("0.3 0 0.2 1").join(";");
const JIGGLE_SCALE = [
  "1 1",
  "1 1",
  "0.94 1",
  "1.035 1",
  "1 1",
  "1 1",
  "1.045 1",
  "0.975 1",
  "1 1",
  "1 1",
].join(";");
const JIGGLE_X = [
  "0 0",
  "0 0",
  "3 0",
  "-1.5 0",
  "0 0",
  "0 0",
  "2 0",
  "-1 0",
  "0 0",
  "0 0",
].join(";");

/** While the case is in it the gate goes solid, and the question with it. */
const lit = (cool: string, hot: string) =>
  [cool, cool, hot, hot, cool, cool].join(";");

function Lit({ attribute, values }: { attribute: string; values: string }) {
  return (
    <animate
      attributeName={attribute}
      dur={CYCLE}
      repeatCount="indefinite"
      calcMode="spline"
      keyTimes={LIT_TIMES}
      keySplines={LIT_SPLINES}
      values={values}
    />
  );
}

export default function GateScene({ play }: { play: boolean }) {
  const frame = useRef<SVGSVGElement>(null);
  // Deterministic on the server; the loop draws again on every turn.
  const [taken, setTaken] = useState<Branch>("up");

  /*
   * A coin, not an alternation: the gate is not taking turns, it is deciding.
   * The draw lands at the turn of the loop, with the case off the frame at
   * both ends, so swapping which of the two is the visible one cannot be seen.
   */
  const redraw = useCallback(() => {
    setTaken(Math.random() < 0.5 ? "up" : "down");
  }, []);

  const beat = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    const pulse = beat.current;

    if (!pulse) return;

    pulse.addEventListener("repeatEvent", redraw);

    return () => pulse.removeEventListener("repeatEvent", redraw);
  }, [redraw]);

  useEffect(() => {
    const svg = frame.current;

    if (!svg) return;

    const still =
      !play || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (still) {
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
        {/* The line has no ends of its own; it runs out into the board. */}
        <linearGradient id="gate-fade" gradientUnits="userSpaceOnUse" x1="0" x2="360">
          <stop className={styles.fadeOut} offset="0%" />
          <stop className={styles.fadeIn} offset="14%" />
          <stop className={styles.fadeIn} offset="86%" />
          <stop className={styles.fadeOut} offset="100%" />
        </linearGradient>

        <mask id="gate-vignette">
          <rect width="360" height="240" fill="url(#gate-fade)" />
        </mask>
      </defs>

      <g mask="url(#gate-vignette)">
        <path className={styles.line} d="M 4 120 H 114" />
        <path className={styles.line} d="M 186 120 C 224 120, 240 66, 356 66" />
        <path className={styles.line} d="M 186 120 C 224 120, 240 174, 356 174" />

        {/* The case, drawn under the gate, so that it goes into it. */}
        {BRANCHES.map((branch) => (
          <ellipse
            key={branch}
            className={styles.case}
            rx="7"
            ry="7"
            opacity={branch === taken ? 1 : 0}
          >
            <animateMotion
              ref={branch === "up" ? beat : undefined}
              dur={CYCLE}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes={KEY_TIMES}
              keyPoints={KEY_POINTS}
              keySplines={KEY_SPLINES}
              path={ROUTES[branch]}
            />
            {/* A small squash on contact and stretch on release sells weight. */}
            <animate
              attributeName="rx"
              dur={CYCLE}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes={KEY_TIMES}
              keySplines={KEY_SPLINES}
              values="7;7;5.8;5.8;8;7;7"
            />
            <animate
              attributeName="ry"
              dur={CYCLE}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes={KEY_TIMES}
              keySplines={KEY_SPLINES}
              values="7;7;7.8;7.8;6.5;7;7"
            />
          </ellipse>
        ))}

        {/* The decision itself: the thing that is still there next time. */}
        <g transform="translate(150 120)">
          <animateTransform
            attributeName="transform"
            type="translate"
            additive="sum"
            dur={CYCLE}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes={JIGGLE_TIMES}
            keySplines={JIGGLE_SPLINES}
            values={JIGGLE_X}
          />

          <g>
            <animateTransform
              attributeName="transform"
              type="scale"
              dur={CYCLE}
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes={JIGGLE_TIMES}
              keySplines={JIGGLE_SPLINES}
              values={JIGGLE_SCALE}
            />

            <path className={styles.gate} d="M 0 -32 L 36 0 L 0 32 L -36 0 Z">
              <Lit attribute="fill" values={lit(PAPER, HOT)} />
              <Lit attribute="stroke" values={lit(COOL, HOT)} />
            </path>

            <text className={styles.ask} x="0" y="1">
              ?
              <Lit attribute="fill" values={lit(INK, PAPER)} />
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
