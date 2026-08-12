"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import LogoMark from "@/components/LogoMark/LogoMark";
import type { LogoTone } from "@/components/LogoMark/LogoMark";
import ParcelScene from "@/components/ParcelScene/ParcelScene";
import styles from "./BrandHero.module.css";

const SESSION_KEY = "coordination:intro-played";

/** How long the splash holds before the brand travels to its resting spot. */
const SPLASH_DURATION = 2150;

/** Widest the splash row may get, as a share of the viewport. */
const SPLASH_WIDTH_RATIO = 0.86;

/** Splash size of the logo box, matching the original full-screen intro. */
const SPLASH_MARK_SIZE = 224;

type Phase = "pending" | "intro" | "settled";

const hasPlayed = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

const markPlayed = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode — the intro simply replays */
  }
};

export default function BrandHero() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [introPlayed, setIntroPlayed] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // The splash plays on black, so the mark only darkens once it lands on paper.
  const tone: LogoTone = phase === "settled" ? "dark" : "light";

  /**
   * Places the brand where the splash needs it: blown up and centred in the
   * viewport, with the row nudged sideways so the mark alone sits on the axis.
   *
   * Everything is read off `.brand` and offset metrics, which stay untouched by
   * the transforms the intro itself applies — so this is safe to redo on resize.
   */
  const measureSplash = useCallback(() => {
    const brand = brandRef.current;
    const flight = flightRef.current;
    const row = rowRef.current;
    const mark = markRef.current;

    if (!brand || !flight || !row || !mark) return false;

    const rest = brand.getBoundingClientRect();
    const markWidth = mark.offsetWidth;
    const markHeight = mark.offsetHeight;

    if (!rest.width || !markWidth || !markHeight) return false;
    if (!window.innerWidth || !window.innerHeight) return false;

    const scale = Math.min(
      SPLASH_MARK_SIZE / markWidth,
      (window.innerWidth * SPLASH_WIDTH_RATIO) / rest.width,
      (window.innerHeight * 0.5) / markHeight,
    );

    if (!Number.isFinite(scale) || scale <= 1) return false;

    // `mark.offsetLeft` is relative to `.brand`, the nearest positioned ancestor.
    const shift = rest.width / 2 - (mark.offsetLeft + markWidth / 2);

    flight.style.setProperty("--flight-x", `${window.innerWidth / 2 - (rest.left + rest.width / 2)}px`);
    flight.style.setProperty("--flight-y", `${window.innerHeight / 2 - (rest.top + rest.height / 2)}px`);
    flight.style.setProperty("--flight-scale", `${scale}`);
    row.style.setProperty("--mark-shift", `${shift}px`);

    return true;
  }, []);

  useLayoutEffect(() => {
    const skip =
      hasPlayed() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (skip) {
      setPhase("settled");
      return;
    }

    // The splash is measured against the viewport, so a restored scroll
    // position would leave it clipped by the hero.
    window.scrollTo(0, 0);

    // A viewport we cannot measure (a page rendered while hidden) would put the
    // splash somewhere arbitrary — better to land straight on the finished page.
    if (!measureSplash()) {
      setPhase("settled");
      return;
    }

    markPlayed();
    setIntroPlayed(true);
    setPhase("intro");
  }, [measureSplash]);

  useEffect(() => {
    if (phase !== "intro") return;

    window.addEventListener("resize", measureSplash);
    const timer = window.setTimeout(() => setPhase("settled"), SPLASH_DURATION);

    return () => {
      window.removeEventListener("resize", measureSplash);
      window.clearTimeout(timer);
    };
  }, [phase, measureSplash]);

  return (
    <section
      className={styles.hero}
      data-phase={phase}
      data-intro={introPlayed ? "true" : undefined}
      data-scroll-stage=""
    >
      <noscript>
        <style>{`.${styles.backdrop}{opacity:0}.${styles.brand},.${styles.headline}{opacity:1}.${styles.wordmark}{-webkit-text-fill-color:#012141}`}</style>
      </noscript>

      {/* Pinned for the length of the stage, so the scroll drives the sorter. */}
      <div className={styles.viewport}>
        {/*
          Sticky positioning makes the viewport its own stacking context, so the
          backdrop has to live inside it to stay under the brand during the
          splash — from outside, its z-index would cover the whole hero.
        */}
        <div className={styles.backdrop} aria-hidden="true" />

        <div className={styles.brand} ref={brandRef}>
          <div className={styles.flight} ref={flightRef}>
            <div className={styles.row} ref={rowRef}>
              <div className={styles.mark} ref={markRef}>
                <LogoMark tone={tone} />
              </div>
              <span className={styles.wordmark}>Coordination</span>
            </div>
          </div>
        </div>

        <h1 className={styles.headline}>Rozwój firmy zaczyna się od dobrych decyzji</h1>

        <ParcelScene />
      </div>
    </section>
  );
}
