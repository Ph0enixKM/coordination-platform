"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Heading } from "@/lib/blog/toc";
import styles from "./TableOfContents.module.css";

/** How far below the top of the window a heading counts as the one being read. */
const READING_LINE = 140;

/**
 * The post's sections: a sticky list beside the article on wide screens that
 * marks the section being read, a collapsible box above it on narrow ones.
 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    let frame = 0;

    const update = () => {
      frame = 0;

      const passed = elements.filter((element) => element.getBoundingClientRect().top <= READING_LINE);

      setActive(passed.at(-1)?.id ?? null);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // Captured, so it also follows a scrolling container such as the editor's preview.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return (
    <nav className={styles.toc} aria-labelledby="toc-title" data-open={open || undefined}>
      <h2 id="toc-title" className={styles.title}>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls="toc-list" onClick={() => setOpen((value) => !value)}>
          Spis treści
          <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
        </button>
        <span className={styles.label}>Spis treści</span>
      </h2>
      <ol id="toc-list" className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={styles.link}
              aria-current={active === heading.id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
