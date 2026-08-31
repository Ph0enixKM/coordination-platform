"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { reshuffled } from "./shuffle";
import styles from "./SlidersScene.module.css";

/**
 * Point 3: three things the firm could do more of, all turned up to the same
 * setting - because that is the assumption, not a decision. The loop is what
 * happens when the question is actually asked: one of them earns a little
 * more, and two of them are turned right down.
 *
 * Both the setting they start from and which one earns the extra are dealt
 * again on every turn, so the drawing never claims that the answer is always
 * the same amount, or always the first one.
 */

/** The track, in user units. One per cent of it is 2.4 of them. */
const LEFT = 60;
const RIGHT = 300;

/** Where the three of them can start, and what they settle at. */
const START = { least: 30, most: 70 } as const;
const TO = [85, 15, 10] as const;

type Deal = { from: number; to: readonly number[] };

/** Whatever the firm happens to have them all turned up to this time. */
function draw(previous: number): number {
  const from =
    START.least + Math.floor(Math.random() * (START.most - START.least + 1));

  return from === previous ? draw(previous) : from;
}

/** Custom properties are how each slider feeds its two values to the keyframes. */
const vars = (values: Record<string, string>) => values as CSSProperties;

export default function SlidersScene({ play }: { play: boolean }) {
  // Deterministic on the server; only the loop ever deals it again.
  const [deal, setDeal] = useState<Deal>({ from: 50, to: TO });

  const redeal = useCallback((event: React.AnimationEvent<SVGGElement>) => {
    // The fill and the knob carry loops of their own, and those bubble here.
    if (event.target !== event.currentTarget) return;

    setDeal((previous) => ({
      from: draw(previous.from),
      to: reshuffled(TO, previous.to),
    }));
  }, []);

  return (
    <svg
      className={styles.scene}
      data-play={play ? "true" : undefined}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      {deal.to.map((to, index) => {
        const y = 76 + index * 44;

        return (
          <g
            key={y}
            className={styles.slider}
            style={vars({
              "--from": String(deal.from),
              "--to": String(to),
              /* Enough of a cascade to read as three decisions, not one. */
              "--lag": `${index * 0.12}s`,
            })}
            onAnimationIteration={index === 0 ? redeal : undefined}
          >
            <line className={styles.track} x1={LEFT} y1={y} x2={RIGHT} y2={y} />
            <line
              className={styles.fill}
              x1={LEFT}
              y1={y}
              x2={RIGHT}
              y2={y}
              pathLength={100}
            />
            <circle className={styles.knob} cx={LEFT} cy={y} r="10" />
          </g>
        );
      })}
    </svg>
  );
}
