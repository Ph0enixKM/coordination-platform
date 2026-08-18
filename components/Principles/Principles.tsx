"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import {
  DecisionScene,
  HiddenCostScene,
  LoopScene,
  OwnerScene,
  RulesScene,
  SystemScene,
  type SceneProps,
} from "./scenes";
import styles from "./Principles.module.css";

type Principle = {
  title: string;
  Scene: (props: SceneProps) => React.JSX.Element;
  /** Ból, Problem, Wartość, Rezultat — in that order. */
  steps: readonly [string, string, string, string];
};

const STEP_LABELS = ["Ból", "Problem", "Wartość", "Rezultat"] as const;

const PRINCIPLES: readonly Principle[] = [
  {
    title: "Nie naprawiamy oddzielnych części firmy",
    Scene: SystemScene,
    steps: [
      "Raz spada sprzedaż, raz marketing nie przynosi zapytań, raz realizacja nie wyrabia się z terminami. Naprawiane osobno, problemy wracają albo przenoszą się w inne miejsce.",
      "Spadek sprzedaży nie musi wynikać z pracy handlowca. Może być skutkiem doboru klientów, niejasnej oferty, nierentownych zleceń albo decyzji właściciela.",
      "Analizujemy firmę jako jeden system powiązanych decyzji. Nie zakładamy z góry, że problem jest tam, gdzie widać jego objaw.",
      "Zmiany w sprzedaży, marketingu i procesach wzmacniają ten sam kierunek, zamiast tworzyć kolejne napięcia w innym miejscu firmy.",
    ],
  },
  {
    title: "Projektujemy zasady działania, a nie wykonujemy kolejnych zadań",
    Scene: RulesScene,
    steps: [
      "Powstaje nowa strona, CRM, kampania i procedura. Właściciel nadal sam łączy to w całość i rozstrzyga większość nietypowych sytuacji.",
      "Bez zasad określających, komu firma sprzedaje, jakie zlecenia przyjmuje i kto podejmuje decyzje, nowe narzędzia zostają dołożone do istniejącego chaosu.",
      "Projektujemy wspólnie z właścicielem kryteria wyboru klientów, oceny zleceń, priorytetów i odpowiedzialności. Narzędzia są ich konsekwencją, nie punktem wyjścia.",
      "Podobne sytuacje nie są rozwiązywane od początku. Decyzje stają się przewidywalne, a wyjątków i nieporozumień jest wyraźnie mniej.",
    ],
  },
  {
    title: "Nie zastępujemy właściciela",
    Scene: OwnerScene,
    steps: [
      "Właściciel chciałby odciążyć się od bieżącego zarządzania, ale boi się utraty kontroli. Trudniejsze decyzje i tak wracają do niego.",
      "Kiedy doradca przejmuje odpowiedzialność za sposób działania firmy, przynosi chwilową ulgę, ale zostawia firmę zależną od siebie.",
      "Pokazujemy zależności, konfrontujemy założenia z faktami i budujemy kryteria, według których właściciel i zespół decydują samodzielnie.",
      "Właściciel zachowuje kontrolę, nie rozstrzygając każdej sytuacji osobiście. Firma jest mniej zależna zarówno od niego, jak i od doradcy.",
    ],
  },
  {
    title: "Pracujemy na realnych decyzjach, nie tylko na dokumentach",
    Scene: DecisionScene,
    steps: [
      "Strategia, cele i procedury są opisane, a codzienne działanie wygląda tak samo jak wcześniej. Priorytety nadal zmieniają się pod wpływem bieżących problemów.",
      "Prawdziwy test zaczyna się przy odrzuceniu niewłaściwego klienta, odmowie rabatu albo rezygnacji z nierentownego zlecenia pod presją sytuacji.",
      "Pracujemy na rzeczywistych zapytaniach, wycenach i decyzjach handlowych. Kiedy firma odchodzi od ustalonych zasad, pokazujemy mechanizm i konsekwencje.",
      "Strategia staje się praktycznym filtrem decyzyjnym, a nie deklaracją zamkniętą w prezentacji po warsztatach.",
    ],
  },
  {
    title: "Ujawniamy ukryte koszty dobrze wyglądającej firmy",
    Scene: HiddenCostScene,
    steps: [
      "Są klienci, przychody i pełny kalendarz, a mimo to brakuje marży, czasu właściciela i poczucia kontroli. Sam obrót niczego nie wyjaśnia.",
      "Część zleceń daje przychód, ale blokuje moce przerobowe, mnoży wyjątki i angażuje właściciela. Firma rośnie ilościowo i słabnie operacyjnie.",
      "Oddzielamy klientów i działania, które realnie wzmacniają firmę, od tych, które tworzą wyłącznie obrót, obciążenie i ryzyko.",
      "Właściciel wie, gdzie firma zarabia, a gdzie jedynie pracuje. Może rozwijać ją bez proporcjonalnego wzrostu chaosu.",
    ],
  },
  {
    title: "Firma przestaje powtarzać te same błędy",
    Scene: LoopScene,
    steps: [
      "Znowu przyjęte zlecenie, którego realizacja nie chciała wykonywać. Znowu rabat bez sprawdzenia marży. Zmieniają się nazwy, nie sytuacje.",
      "Firma usuwa skutki błędów, ale nie wyciąga z nich zasad. Mechanizm, który je wywołał, zostaje bez zmian, więc problem wraca w innej formie.",
      "Sprawdzamy, jakie założenia stały za decyzją i których kryteriów zabrakło. Wnioski przekładamy na zasady wyboru klientów, zleceń i priorytetów.",
      "Te same problemy występują rzadziej, a każdy rozwiązany przypadek zwiększa zdolność zespołu do samodzielnego działania.",
    ],
  },
];

/** Distance a mouse has to travel before a press counts as a drag. */
const DRAG_SLOP = 4;

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);

  // The scroll handler and the drag release both need the current slide
  // without re-binding themselves every time it changes.
  const activeRef = useRef(0);

  /** The slide nearest the middle of the track is the one being read. */
  const readActive = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const middle = track.scrollLeft + track.clientWidth / 2;

    let nearest = 0;
    let best = Infinity;

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;

      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);

      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });

    activeRef.current = nearest;
    setActive(nearest);
  }, []);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slidesRef.current[index];

    if (!track || !slide) return;

    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        readActive();
      });
    };

    readActive();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [readActive]);

  // Scenes stay still until the section is actually on screen.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* --- dragging ---------------------------------------------------------- */

  /**
   * Touch and trackpad already scroll the track natively; this is only here so
   * that a mouse can drag the cards the way the pointer expects to.
   */
  const drag = useRef<{ pointer: number; from: number; scroll: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;

    if (!track || event.pointerType !== "mouse" || event.button !== 0) return;

    drag.current = { pointer: event.pointerId, from: event.clientX, scroll: track.scrollLeft };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;

    if (!track || !state || state.pointer !== event.pointerId) return;

    const travelled = event.clientX - state.from;

    if (!dragging) {
      if (Math.abs(travelled) < DRAG_SLOP) return;

      // Snapping fights a scrollLeft written by hand, so it is switched off for
      // the length of the drag and put back on release.
      setDragging(true);
      track.setPointerCapture(event.pointerId);
    }

    track.scrollLeft = state.scroll - travelled;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;

    if (!track || !state || state.pointer !== event.pointerId) return;

    drag.current = null;

    if (!dragging) return;

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    setDragging(false);
    // Snapping is only back on the next frame, so the settle is booked for then.
    window.requestAnimationFrame(() => goTo(activeRef.current));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (!step) return;

    const next = Math.min(PRINCIPLES.length - 1, Math.max(0, activeRef.current + step));

    if (next === activeRef.current) return;

    event.preventDefault();
    goTo(next);
  };

  return (
    <section
      className={styles.principles}
      id="wartosci"
      ref={sectionRef}
      data-visible={inView ? "true" : undefined}
    >
      <div className={styles.intro}>
        <SectionIntro title="Sześć cech, które nas wyróżnia" />
      </div>

      <div
        className={styles.track}
        ref={trackRef}
        role="group"
        aria-label="Wartości Coordination"
        tabIndex={0}
        data-dragging={dragging ? "true" : undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {PRINCIPLES.map(({ title, Scene, steps }, index) => (
          <article
            key={title}
            className={styles.slide}
            ref={(node) => {
              slidesRef.current[index] = node;
            }}
            data-active={index === active ? "true" : "false"}
            aria-roledescription="slajd"
            aria-label={`${index + 1} z ${PRINCIPLES.length}`}
          >
            <div className={styles.card}>
              <div className={styles.stage}>
                <span className={styles.count}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Scene play={inView && index === active} />
              </div>

              <div className={styles.copy}>
                <h3>{title}</h3>
                <ol className={styles.steps}>
                  {steps.map((step, position) => (
                    <li key={STEP_LABELS[position]}>
                      <span className={styles.label}>{STEP_LABELS[position]}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Poprzednia wartość"
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <ol className={styles.dots}>
          {PRINCIPLES.map(({ title }, index) => (
            <li key={title}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Wartość ${index + 1}: ${title}`}
                aria-current={index === active ? "true" : undefined}
                data-active={index === active ? "true" : undefined}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => goTo(active + 1)}
          disabled={active === PRINCIPLES.length - 1}
          aria-label="Następna wartość"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
