"use client";

import { useId, useRef, useState } from "react";
import CtaButton from "@/components/CtaButton/CtaButton";
import styles from "./MailForm.module.css";

const RECIPIENT = "kontakt@coordination.pl";

/**
 * How long the mail takes to leave the screen. Nothing else may happen while it
 * is still in the air: the confirmation waits for it, and so does a failure.
 */
const FLIGHT_MS = 720;
/** The way back in, when the send failed and the mail has to come home. */
const RETURN_MS = 420;

type State = "idle" | "sending" | "sent" | "returning";

/** The same shape the route insists on, so a refusal never costs a flight. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 4000;
const MAX_EMAIL = 254;
const MAX_PHONE = 32;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** What is wrong with the mail, or null when there is nothing to hold it back. */
function findFault(email: string, phone: string, message: string, consent: boolean) {
  if (!EMAIL.test(email) || email.length > MAX_EMAIL) return "Podaj poprawny adres e-mail.";
  if (!phone) return "Podaj numer telefonu.";
  if (phone.length > MAX_PHONE) return "Podaj krótszy numer telefonu.";
  if (!consent) return "Potrzebujemy zgody na przetwarzanie danych.";
  if (!message) return "Napisz treść wiadomości.";
  if (message.length > MAX_MESSAGE) return "Wiadomość jest za długa. Zmieść się w 4000 znaków.";

  return null;
}

type MailFormProps = {
  /** The message the mail arrives with; it is there to be edited. */
  draft: string;
  /** Extra layers sharing the letter's grid cell - the contact section's envelope. */
  children?: React.ReactNode;
  /** Class for the letter itself, which is how the envelope intro animates it. */
  letterClassName?: string;
  onLetterAnimationEnd?: (event: React.AnimationEvent<HTMLFormElement>) => void;
  stageRef?: React.Ref<HTMLDivElement>;
};

export default function MailForm({
  draft,
  children,
  letterClassName,
  onLetterAnimationEnd,
  stageRef,
}: MailFormProps) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(draft);
  const [consent, setConsent] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const doneRef = useRef<HTMLDivElement>(null);
  // Two of these can share a page - the section's and the modal's - so the
  // labels have to point at this instance's own fields.
  const id = useId();

  /** The message field grows with the writing instead of scrolling inside. */
  const grow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state !== "idle") return;

    // Anything we can see ourselves is said before the mail moves; only the
    // server's own refusals are worth a flight there and back.
    const fault = findFault(email.trim(), phone.trim(), message.trim(), consent);

    if (fault) {
      setError(fault);

      return;
    }

    setError(null);
    setState("sending");

    // The mail leaves the moment it is sent, the way it does on a phone; the
    // request runs underneath and only decides what the reader sees next.
    const flight = wait(FLIGHT_MS);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message, consent, newsletter }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(body?.error ?? "Nie udało się wysłać wiadomości. Spróbuj ponownie.");
      }

      await flight;

      setState("sent");
      setMessage(draft);
      setPhone("");
      setConsent(false);
      setNewsletter(false);
      // Focus follows the reader to what replaced the form.
      window.requestAnimationFrame(() => doneRef.current?.focus());
    } catch (sendError) {
      await flight;

      setError(
        sendError instanceof Error
          ? sendError.message
          : "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
      );
      setState("returning");

      await wait(RETURN_MS);

      setState("idle");
    }
  };

  const sent = state === "sent";
  /** Nothing may be sent until every required part of the mail is there. */
  const ready =
    email.trim() !== "" && phone.trim() !== "" && message.trim() !== "" && consent;

  return (
    <div className={styles.stage} data-state={state} ref={stageRef}>
      {children}

      <form
        className={letterClassName ? `${styles.mail} ${letterClassName}` : styles.mail}
        onSubmit={onSubmit}
        onAnimationEnd={onLetterAnimationEnd}
      >
        <div className={styles.row}>
          <span className={styles.rowLabel}>Do:</span>
          <span className={styles.recipient}>
            <span className={styles.avatar}>
              <img src="/assets/logo.svg" alt="" />
            </span>
            {RECIPIENT}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Temat:</span>
          <span className={styles.subject}>Porozmawiajmy</span>
        </div>

        <label className={styles.hidden} htmlFor={`${id}-message`}>
          Treść wiadomości
        </label>
        <textarea
          id={`${id}-message`}
          className={styles.message}
          name="message"
          required
          maxLength={MAX_MESSAGE}
          rows={5}
          value={message}
          disabled={state !== "idle"}
          onChange={(event) => {
            setMessage(event.target.value);
            grow(event.target);
          }}
        />

        <div className={styles.consents}>
          <label className={styles.consent}>
            <input
              type="checkbox"
              name="consent"
              required
              checked={consent}
              disabled={state !== "idle"}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              Zgadzam się na przetwarzanie moich danych osobowych w celu odpowiedzi na tę
              wiadomość, zgodnie z{" "}
              <a
                href="https://coordination.pl/polityka-prywatnosci/"
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                polityką prywatności
              </a>
              . *
            </span>
          </label>

          <label className={styles.consent}>
            <input
              type="checkbox"
              name="newsletter"
              checked={newsletter}
              disabled={state !== "idle"}
              onChange={(event) => setNewsletter(event.target.checked)}
            />
            <span>Chcę dostawać newsletter Coordination. Bez spamu, można wypisać się w każdej chwili.</span>
          </label>
        </div>

        <div className={styles.actions}>
          <div className={styles.fields}>
            <input
              id={`${id}-email`}
              className={styles.field}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email *"
              aria-label="Twój adres e-mail, na który odpowiemy"
              required
              maxLength={MAX_EMAIL}
              value={email}
              disabled={state !== "idle"}
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              id={`${id}-phone`}
              className={styles.field}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Telefon *"
              aria-label="Twój numer telefonu"
              required
              maxLength={MAX_PHONE}
              value={phone}
              disabled={state !== "idle"}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <CtaButton type="submit" disabled={state !== "idle" || !ready}>
            Wyślij
          </CtaButton>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>

      <div className={styles.done} ref={doneRef} tabIndex={-1} role="status" aria-live="polite">
        {sent && (
          <>
            <svg className={styles.check} viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="23" />
              <path d="M15.5 27 L22.5 34 L37 18.5" />
            </svg>
            <p className={styles.doneTitle}>Wysłano</p>
            <p className={styles.doneNote}>Odezwiemy się tak szybko jak to możliwe.</p>
          </>
        )}
      </div>
    </div>
  );
}
