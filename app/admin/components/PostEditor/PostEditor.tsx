"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Eye, ExternalLink, LoaderCircle, PencilLine, Save } from "lucide-react";
import type { PostContent } from "@/lib/blog/content";
import type { Post, PostSummary } from "@/lib/blog/types";
import PostArticle from "@/components/PostArticle/PostArticle";
import { useAdmin } from "../AdminAuth/AdminAuth";
import ImageField from "../ImageField/ImageField";
import Canvas from "./Canvas";
import MetaPanel from "./MetaPanel";
import styles from "./PostEditor.module.css";

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "saved"; at: Date } | { kind: "error"; message: string };

const timeFormat = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" });

/**
 * Everything that counts as an edit; `updatedAt` changes on every save. Keys
 * are sorted, so picking the same image again, built in another order, is no edit.
 */
const snapshot = ({ updatedAt: _, ...post }: Post) =>
  JSON.stringify(post, (_key, value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)))
      : value,
  );

export default function PostEditor({ id }: { id: number }) {
  const { api } = useAdmin();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [saved, setSaved] = useState("");
  const [loadError, setLoadError] = useState("");
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [categories, setCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api<{ post: Post }>(`/api/admin/posts/${id}`)
      .then(({ post }) => {
        setPost(post);
        setSaved(snapshot(post));
      })
      .catch((reason: Error) => setLoadError(reason.message));

    api<{ posts: PostSummary[] }>("/api/admin/posts")
      .then(({ posts }) => setCategories([...new Set(posts.flatMap((item) => item.categories))].sort()))
      .catch(() => {});
  }, [api, id]);

  const dirty = useMemo(() => post !== null && snapshot(post) !== saved, [post, saved]);

  const postRef = useRef(post);
  postRef.current = post;

  const persist = useCallback(async () => {
    const current = postRef.current;

    if (!current) return;

    setSave({ kind: "saving" });

    try {
      const { post: stored } = await api<{ post: Post }>(`/api/admin/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(current),
      });
      // The server may tidy the slug or fill in the date; typing done meanwhile stays.
      const settled = { slug: stored.slug, publishedAt: stored.publishedAt, updatedAt: stored.updatedAt };

      setPost((latest) => latest && { ...latest, ...settled });
      setSaved(snapshot({ ...current, ...settled }));
      setSave({ kind: "saved", at: new Date() });
    } catch (reason) {
      setSave({ kind: "error", message: (reason as Error).message });
    }
  }, [api, id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        persist();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [persist]);

  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const patch = useCallback((change: Partial<Post>) => setPost((current) => current && { ...current, ...change }), []);

  const changeContent = useCallback(
    (change: (content: PostContent) => PostContent) =>
      setPost((current) => current && { ...current, content: change(current.content) }),
    [],
  );

  function leave(event: React.MouseEvent) {
    if (dirty && !confirm("Masz niezapisane zmiany. Wyjść bez zapisywania?")) event.preventDefault();
  }

  async function remove() {
    if (!post || !confirm(`Usunąć wpis „${post.title}”? Tego nie da się cofnąć.`)) return;

    try {
      await api(`/api/admin/posts/${id}`, { method: "DELETE" });
      setSaved(snapshot(post));
      router.push("/admin");
    } catch (reason) {
      setSave({ kind: "error", message: (reason as Error).message });
    }
  }

  if (loadError) {
    return (
      <div className={styles.center}>
        <p>{loadError}</p>
        <Link href="/admin" className={styles.back}>
          <ChevronLeft size={16} aria-hidden="true" />
          Wróć do listy wpisów
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.center}>
        <LoaderCircle className={styles.spinner} aria-label="Wczytywanie wpisu" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Link href="/admin" className={styles.back} onClick={leave}>
            <ChevronLeft size={16} aria-hidden="true" />
            Wpisy
          </Link>
          <span className={styles.headerTitle}>{post.title || "Bez tytułu"}</span>
          <span
            className={styles.saveState}
            role="status"
            data-kind={save.kind === "error" ? "error" : dirty ? "dirty" : "clean"}
          >
            {save.kind === "saving"
              ? "Zapisywanie…"
              : save.kind === "error"
                ? save.message
                : dirty
                  ? "Niezapisane zmiany"
                  : save.kind === "saved"
                    ? `Zapisano o ${timeFormat.format(save.at)}`
                    : "Wszystko zapisane"}
          </span>
          <button
            type="button"
            className={styles.view}
            aria-pressed={preview}
            onClick={() => setPreview((current) => !current)}
          >
            {preview ? <PencilLine size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            {preview ? "Edytuj" : "Podgląd"}
          </button>
          {post.status === "publish" && (
            <a className={styles.view} href={`/${post.slug}`} target="_blank" rel="noopener">
              <ExternalLink size={15} aria-hidden="true" />
              Zobacz wpis
            </a>
          )}
          <button type="button" className={styles.save} onClick={persist} disabled={save.kind === "saving" || !dirty}>
            <Save size={16} aria-hidden="true" />
            Zapisz
          </button>
        </div>
      </header>

      {preview ? (
        // The post as readers will see it, unsaved edits included.
        <div className={styles.preview}>
          <PostArticle post={post} />
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.canvasArea}>
            <main className={styles.main}>
              <div className={styles.cover}>
                <ImageField value={post.cover} onChange={(cover) => patch({ cover })} label="Dodaj zdjęcie wyróżniające">
                  <textarea
                    className={styles.title}
                    rows={1}
                    placeholder="Tytuł wpisu"
                    aria-label="Tytuł wpisu"
                    value={post.title}
                    onChange={(event) => patch({ title: event.target.value.replace(/\n/g, " ") })}
                  />
                </ImageField>
              </div>
              <div className={styles.sheet}>
                <Canvas content={post.content} onChange={changeContent} />
              </div>
            </main>
          </div>
          <MetaPanel post={post} knownCategories={categories} onChange={patch} onDelete={remove} />
        </div>
      )}
    </div>
  );
}
