"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Megaphone, TrendingUp, Workflow } from "lucide-react";
import styles from "./SystemOfWork.module.css";

/** The four areas that drift in from their own corners and end up together. */
const PARTS = [
  { Icon: Compass, label: "Strategia" },
  { Icon: TrendingUp, label: "Sprzedaż" },
  { Icon: Megaphone, label: "Marketing" },
  { Icon: Workflow, label: "Procesy" },
] as const;

export default function SystemOfWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // The scatter only reads as scatter if the reader is there to watch it close.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={styles.system}
      id="w-czym-pomagamy"
      ref={sectionRef}
      data-visible={inView ? "true" : undefined}
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.title}>Porządkujemy to, co dziś działa osobno</h2>

          <p className={styles.lead}>
            Pomożemy Ci w uporządkowaniu strategii, sprzedaży, marketingu i procesów
            w jeden spójny system działania.
          </p>
        </div>

        <div className={styles.diagram} aria-hidden="true">
          <p className={styles.caption}>Jeden system działania</p>

          <div className={styles.stage}>
            {/* The shell everything gathers inside — glass, not a filled disc. */}
            <div className={styles.shell} />

            <ul className={styles.bubbles}>
              {PARTS.map(({ Icon, label }, index) => (
                <li key={label} style={{ "--i": index } as React.CSSProperties}>
                  <div className={styles.bubble}>
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
