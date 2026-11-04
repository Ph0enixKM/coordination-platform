"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PhasePipeline.module.css";

/**
 * How fast the desktop stages play through: the section's pass from 75% to
 * 25% of the viewport is divided by this, so higher means less scrolling.
 */
const PACE = 4;

/**
 * Extra scroll the desktop rail holds on step 2 before moving on, in stage
 * lengths: 1 means step 2 stays lit for twice as long as the other steps.
 */
const HOLD_ON_SECOND = 1;

type PhasePipelineProps = {
  phases: readonly { name: string; description: string }[];
  /** Rendered above the pipeline, inside the pinned panel on desktop. */
  children?: React.ReactNode;
};

export default function PhasePipeline({ phases, children }: PhasePipelineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = phases.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const desktop = window.matchMedia("(min-width: 900px)");
    let raf = 0;

    // Desktop: map the section's natural pass through the viewport onto the
    // stages. The panel stays in normal document flow instead of trapping the
    // page in a full-screen sticky section.
    //
    // The stages start once the section's top crosses 75% of the viewport and
    // take a quarter of its way to 25% to play through (see PACE). A section that already
    // sits above that line when the page opens (high on a short subpage)
    // starts counting from the top of the page instead, at the same pace, so
    // the first stage is the one showing at scroll 0. The last stage is
    // always reached before the page runs out of scroll.
    const fromScroll = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const start = window.innerHeight * 0.75;
      const end = window.innerHeight * 0.25;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const begin = Math.max(0, top - start);
      // Each stage takes one length of scroll; step 2 takes extra ones on top,
      // so the hold adds scroll instead of squeezing the other stages.
      const weights = Array.from({ length: count }, (_, index) => (index === 1 ? 1 + HOLD_ON_SECOND : 1));
      const total = weights.reduce((sum, weight) => sum + weight, 0);
      const finish = Math.min(begin + (((rect.height + start - end) / PACE) * total) / count, maxScroll);
      const progress =
        finish > begin ? Math.min(1, Math.max(0, (window.scrollY - begin) / (finish - begin))) : 0;
      let reached = 0;
      let next = 0;
      for (; next < count - 1; next++) {
        reached += weights[next] / total;
        if (progress < reached) break;
      }
      setActive(next);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(fromScroll);
    };

    // Mobile: cards flow in normal order, so the stage whose card sits in
    // the middle band of the viewport is the active one.
    const visible = phases.map(() => false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) visible[index] = entry.isIntersecting;
        }
        const next = visible.lastIndexOf(true);
        if (next !== -1) setActive(next);
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );

    const sync = () => {
      if (desktop.matches) {
        observer.disconnect();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        fromScroll();
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        for (const item of wrap.querySelectorAll<HTMLElement>("[data-index]")) {
          observer.observe(item);
        }
      }
    };

    sync();
    desktop.addEventListener("change", sync);

    return () => {
      desktop.removeEventListener("change", sync);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [count, phases]);

  // The rail line runs from the first dot's centre to the last one's; the
  // fill always ends on the active dot, so it lands exactly as a stage turns on.
  const edge = 100 / (2 * count);
  // (active + 0.5) / count − edge simplifies to active / count. Computing it
  // directly avoids a float residue like -3.5e-15%, which the browser rejects
  // as a negative width and falls back to `auto`, stretching the fill.
  const fillWidth = Math.max(0, (active / count) * 100);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.panel}>
        {children && <div className={styles.intro}>{children}</div>}

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railBase} style={{ left: `${edge}%`, right: `${edge}%` }} />
          <span className={styles.railFill} style={{ left: `${edge}%`, width: `${fillWidth}%` }} />
          {phases.map((_, index) => (
            <span
              key={index}
              className={styles.railDot}
              data-lit={index <= active ? "true" : undefined}
            />
          ))}
        </div>

        <div className={styles.items}>
          {phases.map((phase, index) => (
            <div
              key={phase.name}
              className={styles.item}
              data-index={index}
              data-state={index < active ? "done" : index === active ? "active" : "idle"}
            >
              <div className={styles.node} aria-hidden="true">
                <span className={styles.nodeDot} />
              </div>
              <article className={styles.card}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.name}>{phase.name}</h3>
                <p className={styles.text}>{phase.description}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
