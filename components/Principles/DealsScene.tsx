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

/** The fan: four angles around a pivot below the frame. */
const PIVOT = { x: 180, y: 258 } as const;
const ANGLES = [-38, -13, 13, 38] as const;

/** The card, drawn once in its own upright space and then swung into place. */
const CARD = { x: 145, y: 52, width: 70, height: 104 } as const;
const MIDDLE = CARD.x + CARD.width / 2;

/** How far the board's colour is carried past the edge of each card. */
const HALO = 5;

/** The column the worth is drawn in. */
const BAR = { x: 170, width: 20, top: 88, bottom: 148 } as const;

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

        return (
          <g key={angle} transform={`rotate(${angle} ${PIVOT.x} ${PIVOT.y})`}>
            <g
              className={styles.card}
              style={vars({ "--lag": `${index * 0.14}s` })}
              onAnimationIteration={index === 0 ? reshuffle : undefined}
            >
              {/*
                * The board's colour, laid under the card as a ring: on the
                * board it cannot be seen, and on the card underneath it is
                * the whole separation between one white rectangle and the
                * next. A blurred shadow at this contrast simply vanishes.
                */}
              <rect
                className={styles.halo}
                x={CARD.x - HALO}
                y={CARD.y - HALO}
                width={CARD.width + HALO * 2}
                height={CARD.height + HALO * 2}
                rx="15"
              />
              <rect className={styles.paper} {...CARD} rx="10" />

              {/* The side the sales figure is counted on. */}
              <g className={styles.front}>
                {[38, 38, 24].map((width, line) => (
                  <rect
                    key={width * line + line}
                    className={styles.rule}
                    x={161}
                    y={76 + line * 12}
                    width={width}
                    height="4"
                    rx="2"
                  />
                ))}
                <path className={styles.signed} d="M 167 124 l 8 9 l 17 -21" />
              </g>

              {/* And what the same contract leaves behind. */}
              <g className={styles.back}>
                <text className={styles.money} x={MIDDLE} y="80">
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
        );
      })}
    </svg>
  );
}
