"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { slugify } from "@/lib/blog/content";
import { PODCAST_CATEGORY } from "@/lib/blog/rows";
import type { Post } from "@/lib/blog/types";
import styles from "./PostEditor.module.css";

type Props = {
  post: Post;
  knownCategories: string[];
  onChange: (patch: Partial<Post>) => void;
  onDelete: () => void;
};

/** `<input type="datetime-local">` works in local time without a zone. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";

  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null);

export default function MetaPanel({ post, knownCategories, onChange, onDelete }: Props) {
  return (
    <aside className={styles.panel} aria-label="Ustawienia wpisu">
      <Section>
        <div className={styles.segmented} role="radiogroup" aria-label="Status">
          {(["draft", "publish"] as const).map((status) => (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={post.status === status}
              className={styles.segment}
              onClick={() => onChange({ status })}
            >
              {status === "publish" ? "Publikacja" : "Szkic"}
            </button>
          ))}
        </div>
        <Field label="Data publikacji" hint="Pusta: ustawi się przy pierwszej publikacji.">
          <input
            className={styles.input}
            type="datetime-local"
            value={toLocalInput(post.publishedAt)}
            onChange={(event) => onChange({ publishedAt: fromLocalInput(event.target.value) })}
          />
        </Field>
        <Field label="Autor">
          <input className={styles.input} type="text" value={post.author} onChange={(event) => onChange({ author: event.target.value })} />
        </Field>
      </Section>

      <Section title="Adres i kategorie">
        <Field label="Adres wpisu (slug)" hint={`/${post.slug || "…"}`}>
          <div className={styles.inline}>
            <input
              className={styles.input}
              type="text"
              value={post.slug}
              onChange={(event) => onChange({ slug: event.target.value })}
              onBlur={() => onChange({ slug: slugify(post.slug) })}
            />
            <button type="button" className={styles.small} onClick={() => onChange({ slug: slugify(post.title) })}>
              Z tytułu
            </button>
          </div>
        </Field>
        <Field
          label="Kategorie"
          hint={`Wpis z kategorią „${PODCAST_CATEGORY}” trafia do /podcasty (odcinki podcastu) zamiast do bazy wiedzy.`}
        >
          <Categories value={post.categories} known={knownCategories} onChange={(categories) => onChange({ categories })} />
        </Field>
      </Section>

      <Section title="SEO">
        <Field label="Tytuł SEO" counter={[post.seoTitle.length, 60]}>
          <input
            className={styles.input}
            type="text"
            placeholder={post.title}
            value={post.seoTitle}
            onChange={(event) => onChange({ seoTitle: event.target.value })}
          />
        </Field>
        <Field label="Opis meta" counter={[post.seoDescription.length, 160]}>
          <textarea
            className={styles.textarea}
            rows={4}
            value={post.seoDescription}
            onChange={(event) => onChange({ seoDescription: event.target.value })}
          />
        </Field>
        <Field label="Fraza kluczowa">
          <input className={styles.input} type="text" value={post.focusKeyword} onChange={(event) => onChange({ focusKeyword: event.target.value })} />
        </Field>
      </Section>

      <button type="button" className={styles.danger} onClick={onDelete}>
        <Trash2 size={15} aria-hidden="true" />
        Usuń wpis
      </button>
    </aside>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  counter?: [number, number];
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldHead}>
        {label}
        {counter && (
          <span className={styles.counter} data-over={counter[0] > counter[1] || undefined}>
            {counter[0]} / {counter[1]}
          </span>
        )}
      </span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}

function Categories({ value, known, onChange }: { value: string[]; known: string[]; onChange: (value: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    const name = draft.trim();

    if (name && !value.includes(name)) onChange([...value, name]);
    setDraft("");
  }

  return (
    <div className={styles.chips}>
      {value.map((category) => (
        <span key={category} className={styles.chip}>
          {category}
          <button
            type="button"
            aria-label={`Usuń kategorię ${category}`}
            onClick={(event) => {
              event.preventDefault();
              onChange(value.filter((item) => item !== category));
            }}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        className={styles.chipInput}
        type="text"
        list="known-categories"
        placeholder="Dodaj kategorię i Enter"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={add}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add();
          }
        }}
      />
      <datalist id="known-categories">
        {known
          .filter((category) => !value.includes(category))
          .map((category) => (
            <option key={category} value={category} />
          ))}
      </datalist>
    </div>
  );
}
