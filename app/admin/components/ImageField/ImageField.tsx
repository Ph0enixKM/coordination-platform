"use client";

import { useEffect, useRef, useState } from "react";
import { Captions, ImagePlus, Link as LinkIcon, LoaderCircle, Trash2, Upload } from "lucide-react";
import type { ImageValue } from "@/lib/blog/content";
import { useAdmin } from "../AdminAuth/AdminAuth";
import MediaLibrary from "../MediaLibrary/MediaLibrary";
import styles from "./ImageField.module.css";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml";

type Props = {
  value: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
  /** Shown in the empty drop zone. */
  label?: string;
  /**
   * Content laid over the image, like the title on the post header. With it
   * the field becomes a navy banner the image fills once there is one.
   */
  children?: React.ReactNode;
  /** Where the image leads when clicked; adds a link button to the preview. */
  link?: { href?: string; onChange: (href: string | undefined) => void };
};

/**
 * Picks or drops an image and uploads it; the server stores it as WebP
 * (quality 80, longest edge at most 1920 px). Clicking opens the media
 * library, to reuse an uploaded image or pick a new one. The alt text, which belongs to
 * the image wherever it is used, opens from a button on the preview.
 */
export default function ImageField({
  value,
  onChange,
  label = "Przeciągnij zdjęcie lub kliknij, aby wybrać",
  children,
  link,
}: Props) {
  const { api } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [library, setLibrary] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const { image } = await api<{ image: ImageValue }>("/api/admin/media", { method: "POST", body: form });

      // Replacing a picture keeps the alt text that was already written for it.
      onChange({ ...image, alt: value?.alt || image.alt });
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const picker = (
    <>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(event) => upload(event.target.files?.[0])}
      />
      {library && (
        <MediaLibrary
          current={value?.src}
          // A picture from the library keeps the alt text already written here.
          onPick={(item) => onChange({ src: item.src, width: item.width, height: item.height, alt: value?.alt ?? "" })}
          onUpload={() => input.current?.click()}
          onDropFile={upload}
          onClose={() => setLibrary(false)}
        />
      )}
    </>
  );

  const dropHandlers = {
    onDragOver: (event: React.DragEvent) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event: React.DragEvent) => {
      if (!event.dataTransfer.files.length) return;
      event.preventDefault();
      setDragging(false);
      upload(event.dataTransfer.files[0]);
    },
  };

  const actions = value && (
    <div className={styles.actions}>
      <AltText value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
      {link && <LinkTarget href={link.href} onChange={link.onChange} />}
      <button type="button" className={styles.action} onClick={() => setLibrary(true)} disabled={busy}>
        <Upload size={14} aria-hidden="true" />
        Zmień
      </button>
      <button
        type="button"
        className={styles.action}
        onClick={() => onChange(null)}
        disabled={busy}
        aria-label="Usuń zdjęcie"
        title="Usuń zdjęcie"
      >
        <Trash2 size={14} aria-hidden="true" />
      </button>
    </div>
  );

  const failure = error && (
    <p className={styles.error} role="alert">
      {error}
    </p>
  );

  if (children !== undefined) {
    return (
      <div className={styles.field}>
        {picker}
        <div className={styles.banner} data-image={value ? "" : undefined} data-dragging={dragging || undefined} {...dropHandlers}>
          {value && <img className={styles.bannerImage} src={value.src} alt={value.alt} />}
          <div className={styles.bannerContent}>{children}</div>
          {actions ?? (
            <div className={styles.actions}>
              <button type="button" className={styles.action} onClick={() => setLibrary(true)} disabled={busy}>
                <ImagePlus size={14} aria-hidden="true" />
                {label}
              </button>
            </div>
          )}
          {busy && (
            <div className={styles.overlay}>
              <LoaderCircle className={styles.spinner} aria-label="Konwersja do WebP i wysyłanie" />
            </div>
          )}
        </div>
        {failure}
      </div>
    );
  }

  if (!value) {
    return (
      <div className={styles.field}>
        {picker}
        <button
          type="button"
          className={styles.drop}
          data-dragging={dragging || undefined}
          disabled={busy}
          onClick={() => setLibrary(true)}
          {...dropHandlers}
        >
          {busy ? (
            <>
              <LoaderCircle className={styles.spinner} aria-hidden="true" />
              Konwersja do WebP i wysyłanie…
            </>
          ) : (
            <>
              <ImagePlus size={26} aria-hidden="true" />
              {label}
              <span className={styles.note}>PNG, JPG, WebP, GIF, AVIF lub SVG, do 25 MB</span>
            </>
          )}
        </button>
        {failure}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      {picker}
      <div className={styles.preview} data-dragging={dragging || undefined} {...dropHandlers}>
        <img src={value.src} alt={value.alt} width={value.width} height={value.height} />
        {busy && (
          <div className={styles.overlay}>
            <LoaderCircle className={styles.spinner} aria-hidden="true" />
          </div>
        )}
        {actions}
      </div>
      {value.width && value.height && (
        <p className={styles.note}>
          {value.width} × {value.height} px
        </p>
      )}
      {failure}
    </div>
  );
}

/** A button on the preview that opens a small form under it. */
function Popover({
  button,
  children,
}: {
  button: (props: { "aria-expanded": boolean; onClick: () => void }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className={styles.anchor} ref={ref}>
      {button({ "aria-expanded": open, onClick: () => setOpen((current) => !current) })}
      {open && <div className={styles.popover}>{children(() => setOpen(false))}</div>}
    </div>
  );
}

/** Enter or Escape closes the field's popover. */
const closeOn = (close: () => void) => (event: React.KeyboardEvent) => {
  if (event.key === "Enter" || event.key === "Escape") {
    event.preventDefault();
    close();
  }
};

/** The alt text button; marked while the text is still missing. */
function AltText({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const missing = !value.trim();

  return (
    <Popover
      button={(props) => (
        <button
          type="button"
          className={styles.action}
          data-missing={missing || undefined}
          title={missing ? "Brak tekstu alternatywnego" : `Tekst alternatywny: ${value}`}
          {...props}
        >
          <Captions size={14} aria-hidden="true" />
          Alt
        </button>
      )}
    >
      {(close) => (
        <label className={styles.popoverLabel}>
          Tekst alternatywny
          <textarea
            className={styles.input}
            rows={3}
            value={value}
            placeholder="Co widać na zdjęciu?"
            autoFocus
            onChange={(event) => onChange(event.target.value.replace(/\n/g, " "))}
            onKeyDown={closeOn(close)}
          />
        </label>
      )}
    </Popover>
  );
}

/** The link button; filled in while the image leads somewhere. */
function LinkTarget({ href, onChange }: { href?: string; onChange: (href: string | undefined) => void }) {
  return (
    <Popover
      button={(props) => (
        <button
          type="button"
          className={styles.action}
          data-set={href ? "" : undefined}
          aria-label="Link po kliknięciu"
          title={href ? `Link: ${href}` : "Dodaj link po kliknięciu"}
          {...props}
        >
          <LinkIcon size={14} aria-hidden="true" />
        </button>
      )}
    >
      {(close) => (
        <>
          <label className={styles.popoverLabel}>
            Link po kliknięciu
            <input
              className={styles.input}
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={href ?? ""}
              autoFocus
              onChange={(event) => onChange(event.target.value || undefined)}
              onKeyDown={closeOn(close)}
            />
          </label>
          {href && (
            <button
              type="button"
              className={styles.popoverClear}
              onClick={() => {
                onChange(undefined);
                close();
              }}
            >
              Usuń link
            </button>
          )}
        </>
      )}
    </Popover>
  );
}
