"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { reshuffled } from "./shuffle";
import styles from "./DealsScene.module.css";

/**
 * Point 4: four contracts, won, signed, and identical from the front - which
 * is the side the sales number is counted on. The loop turns them over, and
 * what each one is actually worth is not the same at all.
 *
 * Which card carries which is reshuffled every time they land face down again,
 * so the drawing never claims that the good ones are the ones on the right.
 */

/** What the four are worth, per cent of the best one the firm could take. */
const WORTH = [85, 65, 35, 20] as const;

/**
 * The fan: four cards held in one hand. The pivot sits well below the frame,
 * where the hand would be, so the spread is gentle and the faces stay close to
 * upright - a steep fan around a near pivot tips the outer cards on their side.
 */
const PIVOT = { x: 180, y: 392 } as const;
const ANGLES = [-16, -5.5, 5.5, 16] as const;

/**
 * Nobody holds four cards perfectly even. Each one is a touch off its slot -
 * a fraction of a degree, a pixel or two deeper in the hand - so the fan reads
 * as held rather than laid out with a protractor.
 */
const NUDGE = [
  { turn: -0.9, sink: 3 },
  { turn: 0.7, sink: -1 },
  { turn: -0.5, sink: 1 },
  { turn: 1.2, sink: 4 },
] as const;

/** The card, drawn once in its own upright space and then swung into place. */
const CARD = { x: 145, y: 62, width: 70, height: 104 } as const;
const MIDDLE = CARD.x + CARD.width / 2;

/** The column the worth is drawn in. */
const BAR = { x: 170, width: 20, top: 98, bottom: 158 } as const;

const vars = (values: Record<string, string>) => values as CSSProperties;

export default function DealsScene({ play }: { play: boolean }) {
  // Deterministic on the server; only the loop ever reorders it.
  const [worth, setWorth] = useState<readonly number[]>(WORTH);

  const reshuffle = useCallback((event: React.AnimationEvent<SVGGElement>) => {
    // The faces carry loops of their own, and those bubble through here too.
    if (event.target !== event.currentTarget) return;

    setWorth((previous) => reshuffled(WORTH, previous));
  }, []);

  return (
    <svg
      className={styles.scene}
      data-play={play ? "true" : undefined}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      {ANGLES.map((angle, index) => {
        const height = ((BAR.bottom - BAR.top) * worth[index]) / 100;
        const { turn, sink } = NUDGE[index];

        return (
          /*
           * The shadow is cast from outside the swing, so it falls straight
           * down for every card whatever its angle - the way light from above
           * would - and lands on the card underneath as the only separation
           * the two need.
           */
          <g key={angle} className={styles.lift}>
            <g
              transform={`rotate(${angle + turn} ${PIVOT.x} ${PIVOT.y}) translate(0 ${sink})`}
            >
              <g
                className={styles.card}
                style={vars({ "--lag": `${index * 0.16}s` })}
                onAnimationIteration={index === 0 ? reshuffle : undefined}
              >
                <rect className={styles.paper} {...CARD} rx="9" />

                {/* The side the sales figure is counted on. */}
                <g className={styles.front}>
                  {[38, 38, 24].map((width, line) => (
                    <rect
                      key={width * line + line}
                      className={styles.rule}
                      x={161}
                      y={86 + line * 12}
                      width={width}
                      height="4"
                      rx="2"
                    />
                  ))}
                  <path
                    className={styles.signed}
                    d="M 167 134 l 8 9 l 17 -21"
                  />
                </g>

                {/* And what the same contract leaves behind. */}
                <g className={styles.back}>
                  <text className={styles.money} x={MIDDLE} y="90">
                    $
                  </text>
                  <rect
                    className={styles.column}
                    x={BAR.x}
                    y={BAR.top}
                    width={BAR.width}
                    height={BAR.bottom - BAR.top}
                    rx="10"
                  />
                  <rect
                    className={styles.worth}
                    x={BAR.x}
                    y={BAR.bottom - height}
                    width={BAR.width}
                    height={height}
                    rx="10"
                  />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
