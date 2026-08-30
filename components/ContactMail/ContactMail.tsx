"use client";

import { useEffect, useRef, useState } from "react";
import MailForm from "@/components/MailForm/MailForm";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import styles from "./ContactMail.module.css";

/** The mail arrives already written, the way a draft does; it is there to be edited. */
const DRAFT =
  "Cześć jestem zainteresowany waszą ofertą i chciałbym z wami współpracować. Do usłyszenia.";

export default function ContactMail() {
  const stageRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  /** The mail waits in the envelope until the reader has the envelope in view. */
  const [opened, setOpened] = useState(false);
  // The envelope is a one-shot intro prop - once it has fallen away it leaves
  // the DOM, so nothing of it can be scrolled to or painted again.
  const [envelopeGone, setEnvelopeGone] = useState(false);
  // The letter keeps growing after the envelope lands; its animation is only
  // cleared once it has finished, or it would snap back to its parked size.
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // The parked letter has to fit inside the envelope, but the envelope's
        // proportions are fixed while the letter grows taller as the screen
        // narrows - so the parked scale is solved from the real sizes. With
        // the letter and envelope center-aligned in one cell, and the parked
        // transform being translateY(14%) scale(s) about an origin 40% down
        // the letter, the letter's scaled bottom edge sits at
        // 0.04·L + 0.6·s·L below the cell's center; keeping it just above the
        // envelope's bottom edge (0.48·E) gives s.
        const letter = stage.querySelector("form");
        const envelopeHeight = envelopeRef.current?.clientHeight ?? 0;

        if (letter && envelopeHeight > 0) {
          const letterHeight = letter.offsetHeight;
          const scale =
            (0.48 * envelopeHeight - 0.04 * letterHeight) / (0.6 * letterHeight);

          stage.style.setProperty(
            "--letter-parked-scale",
            String(Math.min(0.6, Math.max(0.1, scale))),
          );
        }

        setOpened(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const layer = (extra: string) =>
    `${styles.envelopeLayer} ${extra}${opened ? ` ${styles.playing}` : ""}`;

  return (
    <section className={styles.contact} id="kontakt">
      <div className={styles.intro}>
        <SectionIntro title="Chcesz zadać nam pytanie?">
          Skontaktuj się z naszą załogą. Odpiszemy tak szybko jak to możliwe.
        </SectionIntro>
      </div>

      <MailForm
        draft={DRAFT}
        stageRef={stageRef}
        letterClassName={introDone ? undefined : opened ? styles.letter : styles.letterWaiting}
        onLetterAnimationEnd={(event) => {
          if (event.animationName.includes("letter-out")) setIntroDone(true);
        }}
      >
        {!envelopeGone && (
          <>
            {/* Behind the letter: the envelope's body and its opening flap. */}
            <div
              className={layer(styles.envelopeBack)}
              ref={envelopeRef}
              aria-hidden="true"
              onAnimationEnd={(event) => {
                if (event.animationName.includes("envelope-fall")) setEnvelopeGone(true);
              }}
            >
              <div className={styles.envelope}>
                <span className={styles.body} />
                <span className={styles.flap} />
              </div>
            </div>

            {/* In front of the letter: the pocket it slides out of. */}
            <div className={layer(styles.envelopeFront)} aria-hidden="true">
              <div className={styles.envelope}>
                <span className={styles.pocket} />
                <img className={styles.mark} src="/assets/logo.svg" alt="" />
              </div>
            </div>
          </>
        )}
      </MailForm>
    </section>
  );
}
