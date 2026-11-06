"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { CalendarCheck, Check } from "lucide-react";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { PROCESS_STEPS, stepNumber } from "@/lib/content/process";
import styles from "./ProcessTimeline.module.css";

/** How long each step shows while the timeline plays itself. */
const STEP_MS = 5200;

const LAST = PROCESS_STEPS.length - 1;

/**
 * "Jak wygląda proces pracy z nami?" as a timeline. On wide screens it is a
 * row of five steps with the chosen one told below; once it is on screen it
 * walks through them on its own, once, until the visitor picks one. On narrow
 * screens every step is listed down a line.
 */
export default function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  // Set for good once the visitor takes over, or the walk reaches the end.
  const [stopped, setStopped] = useState(false);
  // The narrow list's steps the visitor has opened; all start closed.
  const [open, setOpen] = useState<number[]>([]);
  const rail = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const element = rail.current;

    if (!element) return;

    // Reduced motion, or the narrow layout where the row is not shown.
    const still = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 760px)");

    if (still.matches) {
      setStopped(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.6 });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const playing = visible && !stopped;

  useEffect(() => {
    if (!playing) return;

    const timer = window.setTimeout(() => {
      if (active + 1 >= LAST) setStopped(true);
      setActive(Math.min(active + 1, LAST));
    }, STEP_MS);

    return () => window.clearTimeout(timer);
  }, [playing, active]);

  function choose(index: number) {
    setStopped(true);
    setActive(index);
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    const edge = { Home: 0, End: LAST }[event.key];

    if (step === undefined && edge === undefined) return;

    event.preventDefault();

    const next = edge ?? Math.min(LAST, Math.max(0, active + step!));

    choose(next);
    tabs.current[next]?.focus();
  }

  const step = PROCESS_STEPS[active];

  return (
    <section className={styles.section} id="proces-pracy">
      <div className={styles.inner}>
        <SectionIntro title="Jak wygląda proces pracy z nami?">
          Pięć kroków od uporządkowania faktów do firmy, która działa przewidywalnie, a nie reaktywnie.
        </SectionIntro>

        {/* Before the first step: the free start, and the way to the form. */}
        <div className={styles.start}>
          <span className={styles.startIcon} aria-hidden="true">
            <CalendarCheck />
          </span>
          <p className={styles.startTitle}>Zanim zaczniemy, trzy bezpłatne spotkania</p>
          <a className={styles.startCta} href="#kontakt">
            Umów pierwsze spotkanie
          </a>
        </div>

        {/* Wide screens: the row of steps and the chosen one below it. */}
        <div className={styles.wide}>
          <div
            ref={rail}
            className={styles.rail}
            role="tablist"
            aria-label="Kroki współpracy"
            data-playing={playing || undefined}
            style={{ "--progress": active / LAST, "--step-ms": `${STEP_MS}ms` } as CSSProperties}
            onKeyDown={onKeyDown}
          >
            <span className={styles.track} aria-hidden="true">
              <span className={styles.fill} />
            </span>
            {PROCESS_STEPS.map((item, index) => (
              <button
                key={item.title}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${id}-panel`}
                tabIndex={index === active ? 0 : -1}
                className={styles.tab}
                data-done={index < active || undefined}
                onClick={() => choose(index)}
              >
                <span className={styles.dot}>{index < active ? <Check aria-hidden="true" /> : stepNumber(index).slice(0, 2)}</span>
                <span className={styles.tabTitle}>{item.title}</span>
                {index === active && playing && <span key={active} className={styles.timer} aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div
            className={styles.panel}
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${active}`}
          >
            <div key={active} className={styles.panelBody}>
              <span className={styles.bigNumber} aria-hidden="true">
                {stepNumber(active)}
              </span>
              <div>
                <h3 className={styles.panelTitle}>{step.title}</h3>
                <p className={styles.panelText}>{step.description}</p>
                <p className={styles.outcome}>
                  <Check aria-hidden="true" />
                  <span>{step.outcome}</span>
                </p>
              </div>
            </div>
            {/* Outside the animated body, so it stays put in its corner. */}
            {active < LAST ? (
              <button type="button" className={styles.next} onClick={() => choose(active + 1)}>
                Następny krok
              </button>
            ) : (
              <Link className={styles.next} href="/proces">
                Zobacz, jak pracujemy
              </Link>
            )}
          </div>
        </div>

        {/* Narrow screens: every step down one line, its description shut
            until the visitor opens it. */}
        <ol className={styles.list}>
          {PROCESS_STEPS.map((item, index) => {
            const isOpen = open.includes(index);

            return (
              <li key={item.title} className={styles.item}>
                <span className={styles.dot} aria-hidden="true">
                  {stepNumber(index).slice(0, 2)}
                </span>
                <div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  {/* Closed, only the button shows; open, it follows the
                      whole description. */}
                  <div className={styles.more} data-open={isOpen || undefined}>
                    <div id={`${id}-more-${index}`} className={styles.moreText}>
                      <div className={styles.moreInner}>
                        <p className={styles.itemText}>{item.description}</p>
                        <p className={styles.outcome}>
                          <Check aria-hidden="true" />
                          <span>{item.outcome}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-more-${index}`}
                      onClick={() =>
                        setOpen((current) => (isOpen ? current.filter((opened) => opened !== index) : [...current, index]))
                      }
                    >
                      {isOpen ? "czytaj mniej" : "czytaj więcej"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <p className={styles.footer}>
          <Link href="/proces">Cały proces krok po kroku</Link>
        </p>
      </div>
    </section>
  );
}
