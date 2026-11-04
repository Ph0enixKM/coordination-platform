"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./Checklist.module.css";

export type ChecklistEntry = {
  id: string;
  text: string;
};

/**
 * Lista kontrolna, której pozycje odhaczają się z animacją w miarę
 * przewijania strony do miejsca ich wyświetlenia. Styl kółeczka
 * nawiązuje do checklist z Apple Notes (wypełnienie na zielono z rysowanym ptaszkiem).
 */
export default function Checklist({ items }: { items: readonly ChecklistEntry[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-index"));
          if (Number.isNaN(index)) continue;
          setChecked((prev) => {
            if (prev[index]) return prev;
            const next = prev.slice();
            next[index] = true;
            return next;
          });
        }
      },
      { threshold: 0.55, rootMargin: "0px 0px -12% 0px" },
    );

    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items.length]);

  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li
          key={item.id}
          data-index={index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={styles.item}
          data-checked={checked[index] ? "true" : "false"}
          style={{ "--i": index } as CSSProperties}
        >
          <span className={styles.circle} aria-hidden="true">
            <svg className={styles.check} viewBox="0 0 24 24" fill="none">
              <path
                className={styles.checkPath}
                d="M5 12.5L10 17.5L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.text}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
