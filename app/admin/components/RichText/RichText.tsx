"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Table,
  Undo2,
  Unlink,
} from "lucide-react";
import styles from "./RichText.module.css";

/**
 * Everything the imported posts use and nothing more: headings 2-4, bold,
 * italic, inline code, links, nested lists, quotes, rules, line breaks and
 * tables. Anything else pasted in is dropped by the schema.
 */
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    codeBlock: false,
    strike: false,
    underline: false,
    // It appends an empty paragraph after a closing heading or table on the
    // first click, which counts as an edit; the gap cursor still reaches there.
    trailingNode: false,
    // Tiptap defaults every link to a new tab with rel="nofollow"; links here
    // open in place unless the author ticks the box.
    link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { target: null, rel: null } },
  }),
  TableKit.configure({ table: { resizable: false } }),
  Placeholder.configure({ placeholder: "Zacznij pisać…" }),
];

type Props = {
  html: string;
  onChange: (html: string) => void;
};

/**
 * The editor for one text block. The block renders its two halves where it
 * wants them: the toolbar in its header, the text below.
 */
export function useRichText({ html, onChange }: Props) {
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  // Tiptap writes the same document its own way (&nbsp; for &#160;, table
  // attributes) and may report an update before anything is typed. Until the
  // text really differs from how it loaded, the block keeps its original HTML,
  // so opening a post never marks it as changed.
  const original = useRef({ html, loaded: "" });

  return useEditor({
    extensions,
    content: html,
    immediatelyRender: false,
    editorProps: { attributes: { class: styles.content } },
    onCreate: ({ editor }) => {
      original.current.loaded = editor.getHTML();
    },
    onUpdate: ({ editor }) => {
      const next = editor.getHTML();

      // An empty editor reports "<p></p>"; storing "" keeps empty blocks easy to spot.
      if (editor.isEmpty) changeRef.current("");
      else changeRef.current(next === original.current.loaded ? original.current.html : next);
    },
  });
}

export function RichTextContent({ editor }: { editor: Editor | null }) {
  return <EditorContent editor={editor} className={styles.wrap} />;
}

/** Formatting buttons for one editor; nothing until Tiptap has started. */
export function RichTextToolbar({ editor }: { editor: Editor | null }) {
  return editor ? <Toolbar editor={editor} /> : null;
}

const BLOCK_TYPES = [
  { value: "p", label: "Akapit" },
  { value: "2", label: "Nagłówek 2" },
  { value: "3", label: "Nagłówek 3" },
  { value: "4", label: "Nagłówek 4" },
] as const;

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      block: editor.isActive("heading", { level: 2 })
        ? "2"
        : editor.isActive("heading", { level: 3 })
          ? "3"
          : editor.isActive("heading", { level: 4 })
            ? "4"
            : "p",
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      code: editor.isActive("code"),
      link: editor.isActive("link"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      table: editor.isActive("table"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });
  const [linkOpen, setLinkOpen] = useState(false);
  const chain = () => editor.chain().focus();

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatowanie tekstu">
      <select
        className={styles.select}
        aria-label="Rodzaj bloku"
        value={state.block}
        onChange={(event) => {
          const value = event.target.value;

          if (value === "p") chain().setParagraph().run();
          else chain().setHeading({ level: Number(value) as 2 | 3 | 4 }).run();
        }}
      >
        {BLOCK_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <span className={styles.divider} />

      <Tool label="Pogrubienie (⌘B)" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold size={16} />
      </Tool>
      <Tool label="Kursywa (⌘I)" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic size={16} />
      </Tool>
      <Tool label="Kod (⌘E)" active={state.code} onClick={() => chain().toggleCode().run()}>
        <Code size={16} />
      </Tool>
      <span className={styles.anchor}>
        <Tool label="Link (⌘K)" active={state.link || linkOpen} onClick={() => setLinkOpen((open) => !open)}>
          <LinkIcon size={16} />
        </Tool>
        {linkOpen && <LinkForm editor={editor} onClose={() => setLinkOpen(false)} />}
      </span>
      {state.link && (
        <Tool label="Usuń link" onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
          <Unlink size={16} />
        </Tool>
      )}

      <span className={styles.divider} />

      <Tool label="Lista punktowana" active={state.bulletList} onClick={() => chain().toggleBulletList().run()}>
        <List size={16} />
      </Tool>
      <Tool label="Lista numerowana" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </Tool>
      <Tool label="Cytat" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote size={16} />
      </Tool>
      <Tool label="Linia pozioma" onClick={() => chain().setHorizontalRule().run()}>
        <Minus size={16} />
      </Tool>
      <TableMenu editor={editor} active={state.table} />

      <span className={styles.divider} />

      <Tool label="Wyczyść formatowanie" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting size={16} />
      </Tool>
      <Tool label="Cofnij (⌘Z)" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 size={16} />
      </Tool>
      <Tool label="Ponów (⌘⇧Z)" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 size={16} />
      </Tool>
    </div>
  );
}

type ToolProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Tool({ label, active, disabled, onClick, children }: ToolProps) {
  return (
    <button
      type="button"
      className={styles.tool}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keeps the text selection while the button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function LinkForm({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [href, setHref] = useState(() => (editor.getAttributes("link").href as string | undefined) ?? "");
  const [newTab, setNewTab] = useState(() => editor.getAttributes("link").target === "_blank");

  function apply(event: React.FormEvent) {
    event.preventDefault();

    const url = href.trim();
    const chain = editor.chain().focus().extendMarkRange("link");

    if (!url) chain.unsetLink().run();
    else {
      const attributes = { href: url, target: newTab ? "_blank" : null };

      // With nothing selected, the address itself becomes the link text.
      if (editor.state.selection.empty && !editor.isActive("link")) {
        chain.insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: attributes }] }).run();
      } else chain.setLink(attributes).run();
    }

    onClose();
  }

  return (
    <form className={styles.popover} onSubmit={apply} onKeyDown={(event) => event.key === "Escape" && onClose()}>
      <input
        className={styles.popoverInput}
        type="text"
        inputMode="url"
        placeholder="https://…"
        aria-label="Adres linku"
        autoFocus
        value={href}
        onChange={(event) => setHref(event.target.value)}
      />
      <label className={styles.check}>
        <input type="checkbox" checked={newTab} onChange={(event) => setNewTab(event.target.checked)} />
        Otwórz w nowej karcie
      </label>
      <div className={styles.popoverActions}>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Anuluj
        </button>
        <button type="submit" className={styles.apply}>
          {href.trim() ? "Zapisz link" : "Usuń link"}
        </button>
      </div>
    </form>
  );
}

function TableMenu({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const run = (command: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>) => {
    command(editor.chain().focus()).run();
    setOpen(false);
  };

  const actions: { label: string; command: Parameters<typeof run>[0] }[] = active
    ? [
        { label: "Wiersz powyżej", command: (chain) => chain.addRowBefore() },
        { label: "Wiersz poniżej", command: (chain) => chain.addRowAfter() },
        { label: "Kolumna z lewej", command: (chain) => chain.addColumnBefore() },
        { label: "Kolumna z prawej", command: (chain) => chain.addColumnAfter() },
        { label: "Przełącz wiersz nagłówka", command: (chain) => chain.toggleHeaderRow() },
        { label: "Usuń wiersz", command: (chain) => chain.deleteRow() },
        { label: "Usuń kolumnę", command: (chain) => chain.deleteColumn() },
        { label: "Usuń tabelę", command: (chain) => chain.deleteTable() },
      ]
    : [{ label: "Wstaw tabelę 3 × 3", command: (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }) }];

  return (
    <span className={styles.anchor} ref={ref}>
      <Tool label="Tabela" active={active || open} onClick={() => setOpen((value) => !value)}>
        <Table size={16} />
      </Tool>
      {open && (
        <div className={styles.menu} role="menu">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={styles.menuItem}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => run(action.command)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
