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
          <p className={styles.kicker}>W czym pomagamy</p>

          <h2 className={styles.title}>Porządkujemy to, co dziś działa osobno</h2>

          <p className={styles.lead}>
            Strategia, sprzedaż, marketing i procesy w większości małych firm żyją
            własnym życiem, a właściciel spina je własnym czasem i uwagą. Łączymy je
            w jeden spójny system działania.
          </p>

          <p className={styles.body}>
            Pracujemy w czterech obszarach naraz, bo decyzja w jednym z nich zawsze
            zmienia wynik w pozostałych. Nie zaczynamy od tego, co możemy sprzedać,
            tylko od tego, co w firmie naprawdę nie działa.
          </p>
        </div>

        <div className={styles.diagram} aria-hidden="true">
          <p className={styles.caption}>Jeden system działania</p>

          <div className={styles.stage}>
            {/* The shell everything gathers inside — glass, not a filled disc. */}
            <div className={styles.shell} />

            {/*
              The bubble the shell grows out of: it holds the middle, strains
              against the four, and bursts into the shell.
            */}
            <div className={styles.seed}>
              <div className={styles.bubble} />
            </div>

            <ul className={styles.bubbles}>
              {PARTS.map(({ Icon, label }, index) => (
                <li key={label} style={{ "--i": index } as React.CSSProperties}>
                  <div className={styles.bubble}>
                    {/*
                      The film squeezes, the writing on it does not: this holds
                      the exact inverse of the squash, so the icon and the word
                      ride it undistorted.
                    */}
                    <div className={styles.label}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </div>
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
