"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SITUATIONS } from "@/lib/content/situations";
import styles from "./AfterChange.module.css";

/**
 * „Co ma się zmienić po doradztwie?”: the situations from the top of the page,
 * each set against how it should look once the work has landed. As a row
 * scrolls into view, the old state is struck through and the new one settles
 * in beside it.
 */
export default function AfterChange() {
  const listRef = useRef<HTMLOListElement>(null);
  // Rows start out shown, so the page reads the same without JavaScript; the
  // strike-through only waits for the reader once the script is running.
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const list = listRef.current;

    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const id = (entry.target as HTMLElement).dataset.id;

          if (!id) continue;

          observer.unobserve(entry.target);
          setShown((prev) => new Set(prev).add(id));
        }
      },
      { threshold: 0.6, rootMargin: "0px 0px -10% 0px" },
    );

    for (const row of list.querySelectorAll("[data-id]")) observer.observe(row);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.shell} data-armed={armed ? "true" : undefined}>
      <div className={styles.head} aria-hidden="true">
        <span className={styles.headBefore}>Dziś</span>
        <span />
        <span className={styles.headAfter}>Po doradztwie</span>
      </div>

      <ol className={styles.list} ref={listRef}>
        {SITUATIONS.map((situation) => (
          <li
            key={situation.id}
            data-id={situation.id}
            data-shown={shown.has(situation.id) ? "true" : undefined}
            className={styles.row}
          >
            <p className={styles.before}>
              <span>
                <span className={styles.label}>Dziś<span className={styles.srOnly}>: </span></span>
                <span className={styles.strike}>{situation.title}</span>
              </span>
            </p>

            <span className={styles.arrow} aria-hidden="true">
              <ArrowRight />
            </span>

            <p className={styles.after}>
              <span className={styles.check} aria-hidden="true">
                <Check />
              </span>
              <span>
                <span className={styles.label}>Po doradztwie<span className={styles.srOnly}>: </span></span>
                {situation.after}
              </span>
            </p>
          </li>
        ))}
      </ol>

      <p className={styles.note}>
        Ta zmiana nie ma zostać w prezentacji. Ma być widoczna w codziennych decyzjach, ofertach
        i w tym, ile Twojego czasu wymaga prowadzenie firmy.
      </p>
    </div>
  );
}
