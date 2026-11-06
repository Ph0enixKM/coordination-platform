"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import { FIRM_TYPES } from "@/lib/content/firms";
import styles from "./FirmFinder.module.css";

/**
 * "Dla jakich firm jesteśmy właściwym wyborem?" as a question the visitor
 * answers: they pick the kind of company they run and see the signal such
 * firms come to us with, and in one sentence what we work on there. Every answer is in the
 * page; the picker only chooses which one shows.
 */
export default function FirmFinder() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  /** Arrow keys move between the answers, as in any tab list. */
  function onKeyDown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const edge = { Home: 0, End: FIRM_TYPES.length - 1 }[event.key];

    if (step === undefined && edge === undefined) return;

    event.preventDefault();

    const next = edge ?? (active + step! + FIRM_TYPES.length) % FIRM_TYPES.length;

    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={styles.section} id="dla-jakich-firm">
      <div className={styles.inner}>
        <SectionIntro title="Dla jakich firm jesteśmy właściwym wyborem?">
          Pracujemy z mikro i małymi firmami, najczęściej od 3 do 15 osób, które już działają, mają klientów i
          przychody, ale dalszy rozwój wymaga uporządkowania strategii, sprzedaży i decyzji.
        </SectionIntro>

        <div className={styles.board}>
          <p className={styles.question} id={`${id}-question`}>
            Jaką firmę prowadzisz?
          </p>

          <div className={styles.tabs} role="tablist" aria-labelledby={`${id}-question`} onKeyDown={onKeyDown}>
            {FIRM_TYPES.map(({ id: firm, Icon, label }, index) => (
              <button
                key={firm}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${firm}`}
                aria-selected={index === active}
                aria-controls={`${id}-panel-${firm}`}
                tabIndex={index === active ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(index)}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.tabLabel}>{label}</span>
              </button>
            ))}
          </div>

          {FIRM_TYPES.map((firm, index) => (
            <div
              key={firm.id}
              role="tabpanel"
              id={`${id}-panel-${firm.id}`}
              aria-labelledby={`${id}-tab-${firm.id}`}
              hidden={index !== active}
              className={styles.panel}
            >
              <blockquote className={styles.symptom}>
                <p>{firm.symptom}</p>
              </blockquote>

              <div className={styles.work}>
                <p className={styles.summary}>{firm.summary}</p>
                <Link className={styles.more} href="/dla-kogo">
                  Więcej o tym, dla kogo pracujemy
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
