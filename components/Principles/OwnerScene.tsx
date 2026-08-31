"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { reshuffled } from "./shuffle";
import styles from "./OwnerScene.module.css";

/**
 * Point 7: we do not take the firm over. We are joined to the owner and to
 * nobody else - the one steady line in the drawing - while the decisions his
 * firm actually runs on keep coming up on his side of it, one, two or three at
 * a time, and are answered and gone before the next lot arrive.
 *
 * Nothing of ours ever reaches them. That is the whole point of the picture:
 * the accent stops at the owner.
 *
 * A turn begins and ends with the decisions up, which is also how the drawing
 * rests - so arriving at the slide starts the loop without anything jumping.
 * The set is dealt again three quarters of the way through instead, while there
 * is nothing on show, and the clock for that is carried by the first decision.
 */

type Point = readonly [number, number];

/** The two of us, and the badge they are drawn in. */
const US = { x: 58, y: 120 } as const;
const OWNER = { x: 150, y: 120 } as const;
const RING = 20;

/** A decision, as it is put to the owner. */
const PILL = { width: 84, height: 26 } as const;

/*
 * Where the decisions sit, by how many of them there are. Each set is its own
 * arrangement rather than the first n of one list, so a turn of one and a turn
 * of three both come out balanced against the owner.
 */
const FAN: Record<number, readonly Point[]> = {
  // Off the line we hold with him on purpose: a single decision sitting level
  // with both of us would read as one line running through him to it.
  1: [[270, 84]],
  2: [
    [268, 74],
    [268, 166],
  ],
  3: [
    [264, 62],
    [280, 120],
    [264, 178],
  ],
};

const COUNTS = [1, 2, 3];

/*
 * There are always three of them in the drawing; a turn of one or two simply
 * has the rest of them hidden. They are never taken out and put back, because
 * an element added part way through a turn would begin its own turn there and
 * be out of step with the two beside it for as long as it lasted.
 */
const SLOTS = [0, 1, 2];

/** The kind of thing that comes back to the owner, whatever else is agreed. */
const DECISIONS = [
  "Rabat?",
  "Zlecenie?",
  "Handlowiec?",
  "Współpraca?",
  "Cena?",
  "Priorytet?",
] as const;

type Dealt = {
  order: readonly string[];
  count: number;
};

/** A new set: other decisions, and a different number of them than last time. */
const dealt = (previous: Dealt): Dealt => {
  const counts = COUNTS.filter((count) => count !== previous.count);

  return {
    order: reshuffled(DECISIONS, previous.order),
    count: counts[Math.floor(Math.random() * counts.length)],
  };
};

/**
 * The line from the owner to a decision: it leaves the edge of his badge and
 * stops at the edge of the decision, so neither is drawn through. It is drawn
 * as a dash that keeps travelling back towards him, because that is what these
 * do - they keep coming to him for as long as he is the one deciding.
 */
const wire = ([x, y]: Point) => {
  const toX = x - PILL.width / 2;
  const away = Math.hypot(toX - OWNER.x, y - OWNER.y);

  const fromX = OWNER.x + ((toX - OWNER.x) / away) * RING;
  const fromY = OWNER.y + ((y - OWNER.y) / away) * RING;

  return `M ${fromX.toFixed(1)} ${fromY.toFixed(1)} L ${toX} ${y}`;
};

const vars = (values: Record<string, string>) => values as CSSProperties;

export default function OwnerScene({ play }: { play: boolean }) {
  // Deterministic on the server; only the loop ever deals it again.
  const [deal, setDeal] = useState<Dealt>({ order: DECISIONS, count: 3 });

  useEffect(() => {
    setDeal(dealt);
  }, []);

  const next = useCallback((event: React.AnimationEvent<SVGGElement>) => {
    // Only the clock the first decision carries, which comes round while there
    // is nothing on show. Everything under it - the line, the dashes on it, the
    // decision itself - loops too, and bubbles through here on its way up.
    if (event.target !== event.currentTarget) return;

    setDeal(dealt);
  }, []);

  return (
    <svg
      className={styles.scene}
      data-play={play ? "true" : undefined}
      viewBox="0 0 360 240"
      aria-hidden="true"
      focusable="false"
    >
      {/*
       * Ours: the one line that is always there, and stops where it does. Like
       * every other line here it is drawn out of the owner, so its dashes
       * travel the same way as the rest - towards him.
       */}
      <path
        className={styles.link}
        d={`M ${OWNER.x - RING} ${OWNER.y} L ${US.x + RING} ${US.y}`}
      />

      {SLOTS.map((index) => {
        const up = index < deal.count;
        // A hidden one still needs somewhere to be; it is put where it would
        // stand in a full set, and nobody sees it there.
        const at = FAN[deal.count][index] ?? FAN[SLOTS.length][index];

        return (
          <g
            key={index}
            className={index === 0 ? `${styles.decision} ${styles.clock}` : styles.decision}
            data-up={up ? "true" : undefined}
            style={vars({ "--lag": `${index * 0.1}s` })}
            onAnimationIteration={index === 0 ? next : undefined}
          >
            <path className={styles.wire} d={wire(at)} />

            <g className={styles.card}>
              <rect
                className={styles.pill}
                x={at[0] - PILL.width / 2}
                y={at[1] - PILL.height / 2}
                width={PILL.width}
                height={PILL.height}
                rx="13"
              />
              <text className={styles.ask} x={at[0]} y={at[1]}>
                {deal.order[index]}
              </text>
            </g>
          </g>
        );
      })}

      {/* The owner: one figure, and the decisions are his. */}
      <g>
        <circle className={styles.owner} cx={OWNER.x} cy={OWNER.y} r={RING} />
        <g className={styles.figureOwner} transform={`translate(${OWNER.x} ${OWNER.y})`}>
          <circle cx="0" cy="-4.5" r="4.6" />
          <path d="M -7.2 5.6 a 7.2 7.2 0 0 1 14.4 0 Z" />
        </g>
        <text className={styles.name} x={OWNER.x} y={OWNER.y + 34}>
          właściciel
        </text>
      </g>

      {/* Us: two figures, joined to him and to nothing else on the board. */}
      <g>
        <circle className={styles.halo} cx={US.x} cy={US.y} r={RING + 3.5} />
        <circle className={styles.us} cx={US.x} cy={US.y} r={RING} />
        <g className={styles.figureUs} transform={`translate(${US.x} ${US.y})`}>
          <circle cx="-5" cy="-4.2" r="4.2" />
          <path d="M -11 5.2 a 6 6 0 0 1 12 0 Z" />
          <circle cx="5" cy="-4.2" r="4.2" />
          <path d="M -1 5.2 a 6 6 0 0 1 12 0 Z" />
        </g>
        <text className={`${styles.name} ${styles.nameUs}`} x={US.x} y={US.y + 34}>
          my
        </text>
      </g>
    </svg>
  );
}
