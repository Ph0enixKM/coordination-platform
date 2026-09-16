"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./FaqAccordion.module.css";

export type FaqEntry = {
  question: string;
  /** Each paragraph of the answer, rendered separately. */
  answer: string[];
  /** Optional CTA shown at the end of the answer. */
  cta?: { label: string; href: string };
};

function FaqItem({
  entry,
  open,
  onToggle,
  index,
}: {
  entry: FaqEntry;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className={styles.item} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
      >
        <span className={styles.question}>{entry.question}</span>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </button>

      <div
        className={styles.panel}
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        hidden={!open}
      >
        <div className={styles.panelInner}>
          <p className={styles.answerLabel}>Odpowiedź Coordination:</p>
          {entry.answer.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
          {entry.cta && (
            <a className={styles.cta} href={entry.cta.href}>
              {entry.cta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ entries }: { entries: readonly FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.accordion}>
      {entries.map((entry, index) => (
        <FaqItem
          key={index}
          entry={entry}
          index={index}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
