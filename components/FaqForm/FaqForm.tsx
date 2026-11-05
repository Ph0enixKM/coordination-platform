"use client";

import { useId, useState } from "react";
import styles from "./FaqForm.module.css";

const MAX_QUESTION = 4000;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type State = "idle" | "sending" | "sent" | "error";

function findFault(name: string, email: string, question: string) {
  if (name.length > MAX_NAME) return "Imię jest za długie.";
  if (email && (!EMAIL.test(email) || email.length > MAX_EMAIL))
    return "Podaj poprawny adres e-mail.";
  if (!question) return "Opisz swój problem lub pytanie.";
  if (question.length > MAX_QUESTION)
    return "Pytanie jest za długie. Zmieść się w 4000 znaków.";

  return null;
}

export default function FaqForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const id = useId();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state !== "idle") return;

    const fault = findFault(name.trim(), email.trim(), question.trim());

    if (fault) {
      setError(fault);

      return;
    }

    setError(null);
    setState("sending");

    try {
      const response = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(body?.error ?? "Nie udało się wysłać pytania. Spróbuj ponownie.");
      }

      setState("sent");
      setName("");
      setEmail("");
      setQuestion("");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Nie udało się wysłać pytania. Spróbuj ponownie.",
      );
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className={styles.done} role="status" aria-live="polite">
        <svg className={styles.check} viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="23" />
          <path d="M15.5 27 L22.5 34 L37 18.5" />
        </svg>
        <p className={styles.doneTitle}>Dziękujemy za pytanie</p>
        <p className={styles.doneNote}>
          Przeanalizujemy je, przygotujemy odpowiedź i opublikujemy ją poniżej.
          Jeśli podałeś e-mail, powiadomimy Cię, gdy odpowiedź będzie gotowa.
        </p>
        <button type="button" className={styles.again} onClick={() => setState("idle")}>
          Zadaj kolejne pytanie
        </button>
      </div>
    );
  }

  const ready = question.trim() !== "";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-name`}>
            Twoje imię <span className={styles.optional}>(opcjonalnie)</span>
          </label>
          <input
            id={`${id}-name`}
            className={styles.input}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jak masz na imię?"
            maxLength={MAX_NAME}
            value={name}
            disabled={state === "sending"}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${id}-email`}>
            Adres e-mail <span className={styles.optional}>(dla powiadomienia o odpowiedzi)</span>
          </label>
          <input
            id={`${id}-email`}
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Ty@example.com"
            maxLength={MAX_EMAIL}
            value={email}
            disabled={state === "sending"}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${id}-question`}>
          Opisz swój problem / pytanie
        </label>
        <textarea
          id={`${id}-question`}
          className={styles.textarea}
          name="question"
          required
          maxLength={MAX_QUESTION}
          rows={5}
          placeholder="Napisz, z czym zmagasz się w firmie. Odpowiedź będzie w 100% anonimowa."
          value={question}
          disabled={state === "sending"}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={state === "sending" || !ready}
      >
        {state === "sending" ? "Wysyłanie…" : "Wyślij pytanie"}
      </button>
    </form>
  );
}
