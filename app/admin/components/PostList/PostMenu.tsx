"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FilePen, Globe, PencilLine, Trash2 } from "lucide-react";
import type { PostSummary } from "@/lib/blog/types";
import styles from "./PostList.module.css";

type Props = {
  post: PostSummary;
  /** Where the menu opens: the pointer, or the row for the keyboard menu key. */
  at: { x: number; y: number };
  onRename: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  onClose: () => void;
};

const EDGE = 8;

/** The right-click menu of a post in the list. */
export default function PostMenu({ post, at, onRename, onToggleStatus, onDelete, onClose }: Props) {
  const menu = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(at);

  // Opened near the right or bottom edge, the menu turns back into the window.
  useLayoutEffect(() => {
    const box = menu.current?.getBoundingClientRect();

    if (!box) return;

    setPosition({
      x: Math.max(EDGE, Math.min(at.x, window.innerWidth - box.width - EDGE)),
      y: Math.max(EDGE, Math.min(at.y, window.innerHeight - box.height - EDGE)),
    });
    menu.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
  }, [at]);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) onClose();
    };

    document.addEventListener("mousedown", closeOutside);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  function onKeyDown(event: React.KeyboardEvent) {
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }
  }

  const choose = (action: () => void) => () => {
    onClose();
    action();
  };

  const published = post.status === "publish";

  return (
    <div
      ref={menu}
      className={styles.menu}
      role="menu"
      aria-label={`Akcje wpisu „${post.title}”`}
      style={{ left: position.x, top: position.y }}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button type="button" role="menuitem" className={styles.menuItem} onClick={choose(onRename)}>
        <PencilLine size={15} aria-hidden="true" />
        Zmień tytuł
      </button>
      <button type="button" role="menuitem" className={styles.menuItem} onClick={choose(onToggleStatus)}>
        {published ? <FilePen size={15} aria-hidden="true" /> : <Globe size={15} aria-hidden="true" />}
        {published ? "Przenieś do szkiców" : "Opublikuj"}
      </button>
      <hr className={styles.menuDivider} />
      <button type="button" role="menuitem" className={styles.menuDanger} onClick={choose(onDelete)}>
        <Trash2 size={15} aria-hidden="true" />
        Usuń wpis
      </button>
    </div>
  );
}
