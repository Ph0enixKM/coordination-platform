"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff, LoaderCircle, Search, Upload, X } from "lucide-react";
import type { MediaItem } from "@/lib/media";
import { useAdmin } from "../AdminAuth/AdminAuth";
import styles from "./MediaLibrary.module.css";

type Props = {
  /** The image in use now, marked in the grid. */
  current?: string;
  onPick: (item: MediaItem) => void;
  /** Opens the file picker of the field that asked; the library closes first. */
  onUpload: () => void;
  onDropFile: (file: File) => void;
  onClose: () => void;
};

const sizeFormat = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

/** Every uploaded image in a dialog, to reuse one or upload a new one. */
export default function MediaLibrary({ current, onPick, onUpload, onDropFile, onClose }: Props) {
  const { api } = useAdmin();
  const dialog = useRef<HTMLDialogElement>(null);
  const [media, setMedia] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();

    api<{ media: MediaItem[] }>("/api/admin/media")
      .then(({ media }) => setMedia(media))
      .catch((reason: Error) => setError(reason.message));
  }, [api]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return needle ? media?.filter((item) => item.name.toLowerCase().includes(needle)) : media;
  }, [media, query]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label="Biblioteka zdjęć"
      data-dragging={dragging || undefined}
      onClose={onClose}
      // A click on the backdrop lands on the dialog element itself.
      onMouseDown={(event) => event.target === dialog.current && dialog.current.close()}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false);
      }}
      onDrop={(event) => {
        const file = event.dataTransfer.files[0];

        if (!file) return;
        event.preventDefault();
        dialog.current?.close();
        onDropFile(file);
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title}>Biblioteka zdjęć</h2>
          <label className={styles.search}>
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              placeholder="Szukaj po nazwie pliku"
              aria-label="Szukaj zdjęć"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={styles.upload}
            onClick={() => {
              dialog.current?.close();
              onUpload();
            }}
          >
            <Upload size={15} aria-hidden="true" />
            Wgraj z komputera
          </button>
          <button type="button" className={styles.close} aria-label="Zamknij" onClick={() => dialog.current?.close()}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.body}>
          {error ? (
            <p className={styles.state}>{error}</p>
          ) : !shown ? (
            <p className={styles.state}>
              <LoaderCircle className={styles.spinner} aria-label="Wczytywanie zdjęć" />
            </p>
          ) : shown.length === 0 ? (
            <p className={styles.state}>
              <ImageOff size={24} aria-hidden="true" />
              {query ? "Żadne zdjęcie nie pasuje do wyszukiwania." : "Nie ma jeszcze żadnych zdjęć."}
            </p>
          ) : (
            <ul className={styles.grid}>
              {shown.map((item) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className={styles.item}
                    aria-current={item.src === current || undefined}
                    title={item.name}
                    onClick={() => {
                      dialog.current?.close();
                      onPick(item);
                    }}
                  >
                    <span className={styles.thumb}>
                      <img src={item.src} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.meta}>
                      {item.width && item.height ? `${item.width} × ${item.height} · ` : ""}
                      {sizeFormat.format(item.size / 1024)} KB
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.dropHint} aria-hidden="true">
          Upuść zdjęcie, aby je wgrać
        </p>
      </div>
    </dialog>
  );
}
