"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import MailForm from "@/components/MailForm/MailForm";
import styles from "./MailModal.module.css";

type MailModalProps = {
  /** The message the mail opens with, written for whoever asked for it. */
  draft: string;
  title: string;
  onClose: () => void;
};

export default function MailModal({ draft, title, onClose }: MailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;

    // The page behind must not scroll away under the dialog.
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      // A click that starts inside the dialog and ends here is a drag, not a
      // dismissal, so only the backdrop's own presses close it.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button className={styles.close} type="button" onClick={onClose} aria-label="Zamknij">
          <X aria-hidden="true" />
        </button>

        <MailForm draft={draft} />
      </div>
    </div>
  );
}
