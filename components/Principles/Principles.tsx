"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionIntro from "@/components/SectionIntro/SectionIntro";
import DiagnosisScene from "./DiagnosisScene";
import FlowScene from "./FlowScene";
import SlidersScene from "./SlidersScene";
import DealsScene from "./DealsScene";
import GateScene from "./GateScene";
import CycleScene from "./CycleScene";
import OwnerScene from "./OwnerScene";
import styles from "./Principles.module.css";

type Principle = {
  title: string;
  /** The point as it runs in the source document, paragraph by paragraph. */
  body: readonly string[];
  /** The „Różnica:” line that closes the point. */
  difference: string;
  /** The drawing beside the point. Only the points that have one carry it. */
  Scene?: ComponentType<{ play: boolean }>;
};

const PRINCIPLES: readonly Principle[] = [
  {
    title:
      "Nie zaczynamy od tego, co możemy sprzedać. Zaczynamy od tego, co naprawdę nie działa",
    body: [
      "Agencja marketingowa naturalnie patrzy na marketing. Doradca sprzedaży na sprzedaż. Firma procesowa na procesy. Coordination nie zakłada z góry, gdzie znajduje się rozwiązanie.",
      "Jeżeli klient mówi „marketing nie działa”, nie zaczynamy od kampanii. Jeżeli mówi „handlowiec nie sprzedaje”, nie zaczynamy od szkolenia handlowca. Najpierw sprawdzamy, czy przyczyna rzeczywiście znajduje się tam, gdzie widoczny jest problem.",
    ],
    difference: "nie sprzedajemy rozwiązania przed diagnozą.",
    Scene: DiagnosisScene,
  },
  {
    title: "Nie naprawiamy jednego obszaru kosztem drugiego",
    body: [
      "Marketing może generować więcej leadów, ale niewłaściwych. Sprzedaż może zwiększać obrót, ale obniżać marżę. Handlowiec może zdobywać kontrakty, których realizacja później nie jest w stanie dobrze obsłużyć. Zatrudnienie ludzi może zwiększyć złożoność zamiast odciążyć właściciela.",
      "Dlatego patrzymy na zależności między klientem, ofertą, marketingiem, sprzedażą, marżą, realizacją, ludźmi i decyzjami.",
    ],
    difference:
      "nie optymalizujemy pojedynczego działu. Optymalizujemy jego wpływ na całą firmę.",
    Scene: FlowScene,
  },
  {
    title: "Nie zakładamy, że więcej jest rozwiązaniem",
    body: [
      "Nie zawsze potrzebujesz więcej leadów, więcej sprzedaży, więcej klientów, więcej ludzi, więcej narzędzi i więcej działań.",
      "Czasami firma potrzebuje mniej złych klientów, mniej nierentownych zleceń, mniej wyjątków, mniej decyzji przechodzących przez właściciela i mniej działań konkurujących o zasoby.",
      "W naszym podejściu sprzedaż nie ma być maksymalizowana za wszelką cenę. Ma być lepsza: skierowana do właściwych klientów, opłacalna i możliwa do dowiezienia.",
    ],
    difference:
      "nie pomagamy firmie robić więcej. Pomagamy ustalić, czego warto robić więcej, czego mniej, a czego wcale.",
    Scene: SlidersScene,
  },
  {
    title: "Nie patrzymy tylko na sprzedaż. Patrzymy na jakość sprzedaży",
    body: [
      "Jeżeli problemem jest brak sprzedaży, typową odpowiedzią jest zwiększenie liczby leadów, zatrudnienie handlowca albo poprawa konwersji.",
      "Zadajemy dodatkowe pytania: komu sprzedajemy, co sprzedajemy, na jakiej marży, ile to później kosztuje operacyjnie i czy w ogóle chcemy więcej takich klientów?",
      "To szczególnie mocno widać w firmach, które rosną przychodowo, ale nie poprawiają wyniku.",
    ],
    difference:
      "wynikiem sprzedaży nie jest dla nas tylko podpisany kontrakt. Liczy się także to, co ten kontrakt robi z marżą i resztą firmy.",
    Scene: DealsScene,
  },
  {
    title: "Nie rozwiązujemy tylko bieżącego przypadku. Budujemy zasadę na następny",
    body: [
      "Klient może przyjść z pytaniem: „Czy przyjąć to zlecenie?”, „Czy dać ten rabat?”, „Czy zatrudnić handlowca?”, „Czy wejść w tę współpracę?”.",
      "Możemy pomóc podjąć konkretną decyzję, ale prawdziwa wartość powstaje wtedy, gdy z tego przypadku powstaje kryterium decyzji, które firma wykorzysta również za miesiąc.",
      "To odpowiada przejściu od reagowania na pojedyncze problemy do działania według spójnych zasad.",
    ],
    difference:
      "nie tylko rozwiązujemy problem. Staramy się sprawić, żeby firma wiedziała, jak poradzić sobie z następną podobną sytuacją.",
    Scene: GateScene,
  },
  {
    title: "Nie kończymy na strategii, prezentacji ani rekomendacji",
    body: [
      "Strategia w naszym modelu nie jest dokumentem. Ma wpływać na to, jak firma wybiera klientów, ustala ceny, prowadzi sprzedaż, organizuje realizację i przydziela odpowiedzialność.",
      "Podobnie współpraca nie kończy się na „oto rekomendacje”. Zasady są później sprawdzane na rzeczywistych decyzjach klienta i korygowane w czasie.",
    ],
    difference:
      "efektem nie ma być wiedza o tym, co zrobić. Efektem ma być zmiana sposobu podejmowania rzeczywistych decyzji.",
    Scene: CycleScene,
  },
  {
    title: "Nie przejmujemy firmy od właściciela",
    body: [
      "To ważny wyróżnik wobec fractional managera, zewnętrznego dyrektora czy klasycznego konsultingu wdrożeniowego.",
      "Nie podejmujemy decyzji za właściciela i nie stajemy się jego zewnętrznym dyrektorem marketingu czy sprzedaży. Pomagamy mu lepiej widzieć sytuację, podejmować decyzje i tworzyć zasady działania, ale odpowiedzialność pozostaje w firmie klienta.",
      "To ma znaczenie, bo klient nie powinien po roku współpracy być bardziej zależny od Coordination niż wcześniej.",
    ],
    difference:
      "nie budujemy zależności od doradcy. Budujemy zdolność firmy do podejmowania lepszych decyzji samodzielnie.",
    Scene: OwnerScene,
  },
  /*
   * The last three points have no drawing yet, and a slide that is only type
   * next to slides that are half picture reads as one that is still being
   * written. They are held here, whole, until each has one of its own.
   *
   *   {
   *     title: "Nie odbieramy właścicielowi kontroli. Zmieniamy sposób jej sprawowania",
   *     body: [
   *       "Typowa narracja mówiłaby: „musisz się wycofać”, „musisz delegować”, „przestań być wąskim gardłem”.",
   *       "Właściciel niekoniecznie tego chce. Nadal chce wiedzieć, co dzieje się w jego firmie, i zachować wpływ na najważniejsze decyzje. Problemem jest to, że kontroluje firmę przez osobisty udział w zbyt wielu sprawach.",
   *       "Pomagamy przejść od kontroli przez osobiste pilnowanie do kontroli przez zasady, odpowiedzialności, informacje i kryteria decyzji.",
   *     ],
   *     difference:
   *       "nie mówimy właścicielowi „odsuń się”. Pomagamy mu kontrolować firmę inaczej.",
   *   },
   *   {
   *     title: "Pracujemy szczególnie z firmą, która „działa, ale działa za ciężko”",
   *     body: [
   *       "Nie pracujemy przede wszystkim ze startupem przed pierwszym klientem ani z firmą będącą już korporacją. Nasz klient ma 3–20 osób, sprzedaż, klientów i historię.",
   *       "Firma nie musi być w kryzysie. Problem polega na tym, że dotychczasowy sposób działania zaczyna kosztować coraz więcej czasu, marży i uwagi właściciela.",
   *     ],
   *     difference:
   *       "specjalizujemy się nie tyle w branży, ile w konkretnym momencie rozwoju firmy właścicielskiej.",
   *   },
   *   {
   *     title: "Coordination łączy diagnozę strategiczną z codziennością firmy",
   *     body: [
   *       "Nie jesteśmy tylko strategiem, który mówi, dokąd iść. Nie jesteśmy tylko specjalistą sprzedaży, który poprawia lejek. Nie jesteśmy tylko procesowcem, który rozpisuje odpowiedzialności.",
   *       "Patrzymy na strategiczny kierunek firmy, ale następnie sprawdzamy jego konsekwencje na poziomie konkretnych klientów, ofert, rabatów, zleceń, priorytetów i decyzji zespołu.",
   *     ],
   *     difference:
   *       "to spójność całego modelu, a nie pojedyncza specjalizacja, jest źródłem przewagi Coordination.",
   *   },
   */
];

/** Distance a mouse has to travel before a press counts as a drag. */
const DRAG_SLOP = 4;

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  // The scenes only start once the section has actually been scrolled to, so
  // the first one is not already half over by the time it is read.
  const [seen, setSeen] = useState(false);

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

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
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
    <section className={styles.principles} id="wartosci" ref={sectionRef}>
      <div className={styles.intro}>
        <SectionIntro title="Czym różni się nasze podejście?" />
      </div>

      <div
        className={styles.track}
        ref={trackRef}
        role="group"
        aria-label="Podejście Coordination"
        tabIndex={0}
        data-dragging={dragging ? "true" : undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {PRINCIPLES.map(({ title, body, difference, Scene }, index) => (
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
              {/* Points without a drawing yet keep the room one would take. */}
              <div className={styles.stage}>
                {Scene ? <Scene play={seen && index === active} /> : null}
              </div>

              <div className={styles.copy}>
                <h3>{title}</h3>

                <div className={styles.body}>
                  {body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <p className={styles.difference}>
                  <span className={styles.label}>Różnica</span>
                  {difference}
                </p>
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
          aria-label="Poprzedni punkt"
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <ol className={styles.dots}>
          {PRINCIPLES.map(({ title }, index) => (
            <li key={title}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Punkt ${index + 1}: ${title}`}
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
          aria-label="Następny punkt"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
