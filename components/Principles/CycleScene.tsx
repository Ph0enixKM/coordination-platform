"use client";

import { useEffect, useRef } from "react";
import styles from "./CycleScene.module.css";

/**
 * Point 6: the work does not end at the strategy, the presentation or the
 * recommendation. What is agreed is tried against the firm's real decisions,
 * watched over and corrected - and then it comes back round to the strategy,
 * which is why the drawing is a ring rather than a line.
 *
 * The ring is the whole picture: four stops on it, their names outside it so
 * nothing has to fit inside a box, and the team riding round it and covering
 * the stop it is at. The stop it is at is the only thing in the accent, so at
 * any moment the drawing says one thing - here is where the work is now.
 *
 * The travel and the lighting keep one clock, so both are SMIL - the same
 * reason the gate and its case do in the fifth drawing. A slide that is off
 * screen, or a visitor who asked for less motion, has the timeline parked with
 * the team on the first stop, lit.
 */

const CYCLE = "9.6s";

type Point = readonly [number, number];

/**
 * The ring the work goes round, and the four stops set at its quarters. It is
 * off the middle of the board on purpose: the longest name is on the right, so
 * the ring is pushed left until the drawing and its names sit even in the frame.
 */
const CENTER = { x: 158, y: 120 } as const;
const RX = 84;
const RY = 70;

/** How far outside the ring a name sits, beside a stop or above and below it. */
const BESIDE = 18;
const CLEAR = 24;

/**
 * Written as four quarter arcs clockwise from the top, so the stops land at
 * exactly the quarter points of its length - which is what the travel's
 * keyPoints stop at.
 */
const RING = [
  `M ${CENTER.x} ${CENTER.y - RY}`,
  `A ${RX} ${RY} 0 0 1 ${CENTER.x + RX} ${CENTER.y}`,
  `A ${RX} ${RY} 0 0 1 ${CENTER.x} ${CENTER.y + RY}`,
  `A ${RX} ${RY} 0 0 1 ${CENTER.x - RX} ${CENTER.y}`,
  `A ${RX} ${RY} 0 0 1 ${CENTER.x} ${CENTER.y - RY}`,
].join(" ");

/** Anywhere on the ring, by the angle round it: -90 is the top, 0 the right. */
const on = (degrees: number): Point => {
  const angle = (degrees * Math.PI) / 180;

  return [CENTER.x + RX * Math.cos(angle), CENTER.y + RY * Math.sin(angle)];
};

/** Which way the ring runs at that angle, for the arrows that sit on it. */
const heading = (degrees: number) => {
  const angle = (degrees * Math.PI) / 180;

  return (Math.atan2(RY * Math.cos(angle), -RX * Math.sin(angle)) * 180) / Math.PI;
};

/** When, in fractions of the cycle, the team reaches each stop in turn. */
const ARRIVALS = [0, 0.25, 0.5, 0.75] as const;

/** How long it holds at a stop before moving on. */
const HOLD = 0.15;

/** The short fade either side of arrival and departure. */
const FADE = 0.025;

/*
 * One turn of the ring: hold at a stop, travel to the next, four times over.
 * The last key time lands back at the first stop, so the wrap is one more
 * handover rather than a jump.
 */
const MOTION_TIMES = "0;0.15;0.25;0.40;0.50;0.65;0.75;0.90;1";
const MOTION_POINTS = "0;0;0.25;0.25;0.50;0.50;0.75;0.75;1";
const MOTION_SPLINES = [
  "0 0 1 1",
  "0.42 0 0.2 1",
  "0 0 1 1",
  "0.42 0 0.2 1",
  "0 0 1 1",
  "0.42 0 0.2 1",
  "0 0 1 1",
  "0.42 0 0.2 1",
].join(";");

const HOT = "#f2792d";
const COOL = "#c3d0de";
const NAVY = "#012141";
const PAPER = "#ffffff";
const TINT = "#fde9da";

type Stop = {
  label: string;
  /** Where it sits on the ring, and where its name sits outside it. */
  at: Point;
  text: Point;
  anchor: "middle" | "start" | "end";
};

/*
 * The four stops, clockwise from the top. Strategia and Rekomendacja are where
 * the work is often mistaken for done; Decyzje and Nadzór are what comes after
 * - what was agreed tried on real decisions, then watched over and corrected -
 * and the ring comes back to a strategy the firmer for it.
 *
 * Every name is set outside the ring, on the side the stop is on, so a long one
 * has the width of the board to run into instead of the width of a box.
 */
const STOPS: Stop[] = [
  {
    label: "Strategia",
    at: on(-90),
    text: [CENTER.x, CENTER.y - RY - CLEAR],
    anchor: "middle",
  },
  {
    label: "Rekomendacja",
    at: on(0),
    text: [CENTER.x + RX + BESIDE, CENTER.y],
    anchor: "start",
  },
  {
    label: "Decyzje",
    at: on(90),
    text: [CENTER.x, CENTER.y + RY + CLEAR],
    anchor: "middle",
  },
  {
    label: "Nadzór",
    at: on(180),
    text: [CENTER.x - RX - BESIDE, CENTER.y],
    anchor: "end",
  },
];

/** Halfway along each arc, pointing the way the work goes. */
const ARROWS = [-45, 45, 135, 225];

/**
 * The lighting of one stop: cool until the team arrives, lit while it holds,
 * cool again once it has gone. The first stop is lit at the turn of the loop,
 * which is also where the timeline parks - so the resting picture is the team
 * at the first stop, lit.
 */
function Light({
  index,
  attribute,
  cool,
  hot,
}: {
  index: number;
  attribute: string;
  cool: string;
  hot: string;
}) {
  const arrive = ARRIVALS[index];
  const leave = arrive + HOLD;

  if (index === 0) {
    return (
      <animate
        attributeName={attribute}
        dur={CYCLE}
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;0.15;0.175;0.975;1"
        keySplines="0 0 1 1;0.42 0 0.3 1;0 0 1 1;0.42 0 0.7 1"
        values={[hot, hot, cool, cool, hot].join(";")}
      />
    );
  }

  const pre = (arrive - FADE).toFixed(3);
  const post = (leave + FADE).toFixed(3);

  return (
    <animate
      attributeName={attribute}
      dur={CYCLE}
      repeatCount="indefinite"
      calcMode="spline"
      keyTimes={`0;${pre};${arrive};${leave};${post};1`}
      keySplines="0 0 1 1;0.42 0 0.7 1;0 0 1 1;0.42 0 0.3 1;0 0 1 1"
      values={[cool, cool, hot, hot, cool, cool].join(";")}
    />
  );
}

export default function CycleScene({ play }: { play: boolean }) {
  const frame = useRef<SVGSVGElement>(null);

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
      <path className={styles.ring} d={RING} />

      {ARROWS.map((degrees) => {
        const [x, y] = on(degrees);

        return (
          <path
            key={`arrow-${degrees}`}
            className={styles.arrow}
            d="M -4 -4 L 0 0 L -4 4"
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${heading(degrees).toFixed(1)})`}
          />
        );
      })}

      {STOPS.map((stop, index) => (
        <g key={stop.label}>
          <circle className={styles.stop} cx={stop.at[0]} cy={stop.at[1]} r="7">
            <Light index={index} attribute="stroke" cool={COOL} hot={HOT} />
            <Light index={index} attribute="fill" cool={PAPER} hot={TINT} />
          </circle>

          <text
            className={styles.label}
            x={stop.text[0]}
            y={stop.text[1]}
            textAnchor={stop.anchor}
          >
            {stop.label}
            <Light index={index} attribute="fill" cool={NAVY} hot={HOT} />
          </text>
        </g>
      ))}

      {/*
       * The team: a badge of two figures, riding the ring and covering the stop
       * it is at. The outer group carries the travel; the inner group carries a
       * slow pulse, so the badge is alive even while it is held at a stop.
       */}
      <g>
        <animateMotion
          dur={CYCLE}
          repeatCount="indefinite"
          calcMode="spline"
          rotate="0"
          keyTimes={MOTION_TIMES}
          keyPoints={MOTION_POINTS}
          keySplines={MOTION_SPLINES}
          path={RING}
        />
        <g>
          <animateTransform
            attributeName="transform"
            type="scale"
            dur="1.9s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.5;1"
            keySplines="0.42 0 0.4 1;0.42 0 0.4 1"
            values="1;1.06;1"
          />
          <circle className={styles.teamHalo} cx="0" cy="0" r="13" />
          <circle className={styles.teamBadge} cx="0" cy="0" r="11" />
          <g className={styles.teamFigure}>
            <circle cx="-3.2" cy="-2.2" r="2.3" />
            <path d="M -6.4 2.8 a 3.2 3.2 0 0 1 6.4 0 Z" />
            <circle cx="3.2" cy="-2.2" r="2.3" />
            <path d="M 0 2.8 a 3.2 3.2 0 0 1 6.4 0 Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
