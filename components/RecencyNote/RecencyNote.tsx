"use client";

import { useEffect, useState } from "react";
import styles from "./RecencyNote.module.css";

const DAY = 86_400_000;
const warsawDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Days since the Unix epoch of the calendar day `date` falls on in Poland. */
function calendarDay(date: Date) {
  const [year, month, day] = warsawDate.format(date).split("-").map(Number);

  return Date.UTC(year, month - 1, day) / DAY;
}

/** "Dzisiaj", "Wczoraj", "3 dni temu", "Tydzień temu"; nothing once it is over 13 days old. */
export function recency(release: Date, now = new Date()) {
  const days = calendarDay(now) - calendarDay(release);

  if (days > 13) return null;
  if (days <= 0) return "Dzisiaj";
  if (days === 1) return "Wczoraj";
  if (days <= 6) return `${days} dni temu`;

  return "Tydzień temu";
}

type Props = {
  /** When it came out; nothing is shown until it is known. */
  date: string | number | null;
  /** Words before the label, e.g. "Nowy odcinek". */
  prefix?: string;
  /** "dark" on navy, with a pinging dot; "light", plain grey on the page background. */
  tone?: "dark" | "light";
  /** Space between the note and what it sits under ("top") or above ("bottom"). */
  gap?: "top" | "bottom";
};

/**
 * How long ago something came out, faded in once known. Worked out in the
 * browser after it loads, so the server and the visitor's clock never have
 * to agree on what day it is.
 */
export default function RecencyNote({ date, prefix, tone = "dark", gap = "bottom" }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const time = typeof date === "string" ? Date.parse(date) : date;

    setLabel(time !== null && Number.isFinite(time) ? recency(new Date(time)) : null);
  }, [date]);

  return (
    <div className={styles.reveal} data-shown={label ? "" : undefined}>
      <div className={styles.clip}>
        {label && (
          <p className={styles.label} data-tone={tone} data-gap={gap}>
            {tone === "dark" && <span className={styles.dot} aria-hidden="true" />}
            {prefix ? `${prefix} · ${label}` : label}
          </p>
        )}
      </div>
    </div>
  );
}
