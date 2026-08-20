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
          <h2 className={styles.title}>Porządkujemy i projektujemy to, co dziś działa osobno</h2>

          <p className={styles.lead}>
            Strategia, sprzedaż, marketing i procesy w większości małych firm żyją
            własnym życiem, a właściciel spina je własnym czasem i uwagą. Łączymy je
            w jeden spójny system działania.
          </p>
        </div>

        <div className={styles.diagram} aria-hidden="true">
          <div className={styles.stage}>
            {/*
              The big bubble's refraction. It is a layer of the shell in every
              sense but the DOM: it has to be its own element so the blur can
              reach the four underneath, and it has to sit below the shell's own
              film so it never blurs that. Two rings, because the falloff is
              built by overlapping them — see the stylesheet.
            */}
            <div className={styles.refract} />
            <div className={`${styles.refract} ${styles.refractEdge}`} />

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

            {/*
              The caption rides the bubble instead of sitting on a line above
              it. The arc it runs on is concentric with the bubble and a little
              wider, so the words curve exactly the way the film does.
            */}
            <svg className={styles.caption} viewBox="0 0 1180 1180" focusable="false">
              <path id="system-arc" fill="none" d="M 80.7 404.7 A 542 542 0 0 1 1099.3 404.7" />
              <text>
                <textPath href="#system-arc" startOffset="50%" textAnchor="middle">Jeden system działania</textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
