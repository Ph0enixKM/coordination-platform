"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Copy, GripVertical, Image as ImageIcon, Plus, Podcast, SquarePlay, Trash2, Type } from "lucide-react";
import {
  imageBlock,
  LAYOUTS,
  layoutParts,
  podcastBlock,
  row as newRow,
  textBlock,
  videoBlock,
  type Block,
  type Column,
  type Layout,
  type PodcastBlock,
  type PostContent,
  type Row,
  type TextBlock,
  type VideoBlock,
} from "@/lib/blog/content";
import { applePodcastsEmbed, spotifyEmbed, youtubeEmbed } from "@/lib/blog/embed";
import { PodcastPlayer, VideoEmbed } from "@/components/Embed/Embed";
import ImageField from "../ImageField/ImageField";
import { RichTextContent, RichTextToolbar, useRichText } from "../RichText/RichText";
import * as ops from "./ops";
import styles from "./Canvas.module.css";

type Update = (change: (content: PostContent) => PostContent) => void;

type Drop = { columnId: string; index: number };

/** How each kind of block is named and drawn in its header and in the add menu. */
const BLOCK_KINDS: Record<Block["type"], { label: string; icon: typeof Type; create: () => Block }> = {
  text: { label: "Tekst", icon: Type, create: () => textBlock() },
  image: { label: "Zdjęcie", icon: ImageIcon, create: () => imageBlock() },
  video: { label: "YouTube", icon: SquarePlay, create: () => videoBlock() },
  podcast: { label: "Podcast", icon: Podcast, create: () => podcastBlock() },
};

/** Whether deleting the block throws away something worth a confirmation. */
const filled = (block: Block) =>
  block.type === "text"
    ? Boolean(block.html)
    : block.type === "image"
      ? Boolean(block.image)
      : block.type === "video"
        ? Boolean(block.url)
        : Boolean(block.spotify || block.apple);

const LAYOUT_LABELS: Record<Layout, string> = {
  "1": "Jedna kolumna",
  "1-1": "Dwie równe kolumny",
  "1-2": "Wąska i szeroka kolumna",
  "2-1": "Szeroka i wąska kolumna",
  "1-1-1": "Trzy kolumny",
};

/**
 * The post body as an Elementor-like canvas: rows split into columns, each a
 * stack of text, image, YouTube and podcast blocks. Blocks move with the
 * arrows or by dragging their handle into any column.
 */
export default function Canvas({ content, onChange }: { content: PostContent; onChange: Update }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);

  const dnd = {
    dragging,
    drop,
    start: (blockId: string) => setDragging(blockId),
    over: (target: Drop | null) => setDrop(target),
    end: () => {
      setDragging(null);
      setDrop(null);
    },
    finish: (target: Drop) => {
      if (dragging) onChange((current) => ops.moveBlock(current, dragging, target.columnId, target.index));
      setDragging(null);
      setDrop(null);
    },
  };

  return (
    <div className={styles.canvas}>
      <RowInserter onInsert={(layout) => onChange((current) => ops.insertRow(current, 0, newRow([], layout)))} />
      {content.rows.map((row, index) => (
        <div key={row.id}>
          <RowView row={row} index={index} total={content.rows.length} onChange={onChange} dnd={dnd} />
          <RowInserter
            onInsert={(layout) => onChange((current) => ops.insertRow(current, index + 1, newRow([], layout)))}
          />
        </div>
      ))}
      {content.rows.length === 0 && (
        <div className={styles.emptyCanvas}>
          <p>Wpis jest pusty. Wybierz układ pierwszego wiersza:</p>
          <LayoutPicker onPick={(layout) => onChange((current) => ops.insertRow(current, 0, newRow([textBlock()], layout)))} />
        </div>
      )}
    </div>
  );
}

type Dnd = {
  dragging: string | null;
  drop: Drop | null;
  start: (blockId: string) => void;
  over: (target: Drop | null) => void;
  end: () => void;
  finish: (target: Drop) => void;
};

function RowView({ row, index, total, onChange, dnd }: { row: Row; index: number; total: number; onChange: Update; dnd: Dnd }) {
  const parts = layoutParts(row.layout);
  const hasContent = row.columns.some((column) => column.blocks.length > 0);

  return (
    <section className={styles.row} aria-label={`Wiersz ${index + 1}`}>
      <div className={styles.rowBar}>
        <span className={styles.rowLabel}>Wiersz {index + 1}</span>
        <div className={styles.layouts} role="radiogroup" aria-label="Układ kolumn">
          {LAYOUTS.map((layout) => (
            <button
              key={layout}
              type="button"
              role="radio"
              aria-checked={row.layout === layout}
              className={styles.layoutButton}
              title={LAYOUT_LABELS[layout]}
              aria-label={LAYOUT_LABELS[layout]}
              onClick={() => onChange((current) => ops.setLayout(current, row.id, layout))}
            >
              <LayoutIcon layout={layout} />
            </button>
          ))}
        </div>
        <div className={styles.rowActions}>
          <IconButton label="Przesuń wiersz w górę" disabled={index === 0} onClick={() => onChange((current) => ops.stepRow(current, row.id, -1))}>
            <ArrowUp size={15} />
          </IconButton>
          <IconButton label="Przesuń wiersz w dół" disabled={index === total - 1} onClick={() => onChange((current) => ops.stepRow(current, row.id, 1))}>
            <ArrowDown size={15} />
          </IconButton>
          <IconButton label="Duplikuj wiersz" onClick={() => onChange((current) => ops.duplicateRow(current, row.id))}>
            <Copy size={15} />
          </IconButton>
          <IconButton
            label="Usuń wiersz"
            danger
            onClick={() => {
              if (!hasContent || confirm("Usunąć ten wiersz razem z zawartością?")) {
                onChange((current) => ops.removeRow(current, row.id));
              }
            }}
          >
            <Trash2 size={15} />
          </IconButton>
        </div>
      </div>

      <div className={styles.grid} style={{ gridTemplateColumns: parts.map((part) => `minmax(0, ${part}fr)`).join(" ") }}>
        {row.columns.map((column) => (
          <ColumnView key={column.id} column={column} onChange={onChange} dnd={dnd} multi={parts.length > 1} />
        ))}
      </div>
    </section>
  );
}

function ColumnView({ column, onChange, dnd, multi }: { column: Column; onChange: Update; dnd: Dnd; multi: boolean }) {
  const list = useRef<HTMLDivElement>(null);
  const target = dnd.drop?.columnId === column.id ? dnd.drop.index : null;

  function indexAt(y: number) {
    const blocks = Array.from(list.current?.querySelectorAll<HTMLElement>(":scope > [data-block]") ?? []);
    const after = blocks.findIndex((element) => {
      const box = element.getBoundingClientRect();

      return y < box.top + box.height / 2;
    });

    return after === -1 ? blocks.length : after;
  }

  return (
    <div
      className={styles.column}
      data-multi={multi || undefined}
      onDragOver={(event) => {
        if (!dnd.dragging) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        const index = indexAt(event.clientY);

        if (target !== index) dnd.over({ columnId: column.id, index });
      }}
      onDragLeave={(event) => {
        if (dnd.dragging && !event.currentTarget.contains(event.relatedTarget as Node)) dnd.over(null);
      }}
      onDrop={(event) => {
        if (!dnd.dragging) return;
        event.preventDefault();
        dnd.finish({ columnId: column.id, index: indexAt(event.clientY) });
      }}
    >
      <div ref={list} className={styles.blocks}>
        {column.blocks.map((block, index) => (
          <BlockView
            key={block.id}
            block={block}
            first={index === 0}
            last={index === column.blocks.length - 1}
            indicator={target === index}
            onChange={onChange}
            dnd={dnd}
          />
        ))}
        {target === column.blocks.length && <div className={styles.indicator} />}
      </div>

      <AddBlock
        empty={column.blocks.length === 0}
        onAdd={(block) => onChange((current) => ops.insertBlock(current, column.id, column.blocks.length, block))}
      />
    </div>
  );
}

type BlockProps = {
  block: Block;
  first: boolean;
  last: boolean;
  indicator: boolean;
  onChange: Update;
  dnd: Dnd;
};

function BlockView(props: BlockProps) {
  const { block, onChange } = props;

  if (block.type === "text") return <TextBlockView {...props} block={block} />;
  if (block.type === "video") return <VideoBlockView {...props} block={block} />;
  if (block.type === "podcast") return <PodcastBlockView {...props} block={block} />;

  return (
    <BlockFrame
      {...props}
      body={
        <ImageField
          value={block.image}
          onChange={(image) => onChange((current) => ops.updateBlock(current, block.id, { image }))}
          link={{ href: block.href, onChange: (href) => onChange((current) => ops.updateBlock(current, block.id, { href })) }}
        />
      }
    />
  );
}

function VideoBlockView(props: BlockProps & { block: VideoBlock }) {
  const { block, onChange } = props;

  return (
    <BlockFrame
      {...props}
      body={
        <div className={styles.embedBlock}>
          <LinkField
            label="Link do filmu lub playlisty YouTube"
            placeholder="https://www.youtube.com/watch?v=…"
            value={block.url}
            valid={Boolean(youtubeEmbed(block.url))}
            error="To nie jest link do filmu ani playlisty YouTube."
            onChange={(url) => onChange((current) => ops.updateBlock(current, block.id, { url }))}
          />
          <VideoEmbed url={block.url} />
        </div>
      }
    />
  );
}

/** A podcast on Spotify, Apple Podcasts or both; the page lets readers choose. */
function PodcastBlockView(props: BlockProps & { block: PodcastBlock }) {
  const { block, onChange } = props;

  return (
    <BlockFrame
      {...props}
      body={
        <div className={styles.embedBlock}>
          <LinkField
            label="Spotify"
            placeholder="https://open.spotify.com/episode/…"
            value={block.spotify}
            valid={Boolean(spotifyEmbed(block.spotify))}
            error="To nie jest link do odcinka ani podcastu w Spotify."
            onChange={(spotify) => onChange((current) => ops.updateBlock(current, block.id, { spotify }))}
          />
          <LinkField
            label="Apple Podcasts"
            placeholder="https://podcasts.apple.com/pl/podcast/…"
            value={block.apple}
            valid={Boolean(applePodcastsEmbed(block.apple))}
            error="To nie jest link do odcinka ani podcastu w Apple Podcasts."
            onChange={(apple) => onChange((current) => ops.updateBlock(current, block.id, { apple }))}
          />
          <PodcastPlayer spotify={block.spotify} apple={block.apple} />
        </div>
      }
    />
  );
}

function LinkField({
  label,
  placeholder,
  value,
  valid,
  error,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  valid: boolean;
  error: string;
  onChange: (value: string) => void;
}) {
  const invalid = Boolean(value.trim()) && !valid;

  return (
    <label className={styles.linkField}>
      {label}
      <input
        className={styles.linkInput}
        type="text"
        inputMode="url"
        placeholder={placeholder}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.value.trim())}
      />
      {invalid && <span className={styles.linkError}>{error}</span>}
    </label>
  );
}

/** A text block keeps its formatting buttons in its own header. */
function TextBlockView(props: BlockProps & { block: TextBlock }) {
  const { block, onChange } = props;
  const editor = useRichText({
    html: block.html,
    onChange: (html) => onChange((current) => ops.updateBlock(current, block.id, { html })),
  });

  return <BlockFrame {...props} tools={<RichTextToolbar editor={editor} />} body={<RichTextContent editor={editor} />} />;
}

function BlockFrame({
  block,
  first,
  last,
  indicator,
  onChange,
  dnd,
  tools,
  body,
}: BlockProps & { tools?: React.ReactNode; body: React.ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  const kind = BLOCK_KINDS[block.type];

  return (
    <>
      {indicator && <div className={styles.indicator} />}
      <div ref={element} className={styles.block} data-block data-dragging={dnd.dragging === block.id || undefined}>
        <div className={styles.blockBar}>
          <span
            className={styles.handle}
            draggable
            title="Przeciągnij, aby przenieść blok"
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", block.id);
              if (element.current) event.dataTransfer.setDragImage(element.current, 24, 18);
              dnd.start(block.id);
            }}
            onDragEnd={dnd.end}
          >
            <GripVertical size={14} aria-hidden="true" />
            <kind.icon size={13} aria-hidden="true" />
            {kind.label}
          </span>
          {tools && <div className={styles.tools}>{tools}</div>}
          <span className={styles.blockActions}>
            <IconButton label="Przesuń blok w górę" disabled={first} onClick={() => onChange((current) => ops.stepBlock(current, block.id, -1))}>
              <ArrowUp size={14} />
            </IconButton>
            <IconButton label="Przesuń blok w dół" disabled={last} onClick={() => onChange((current) => ops.stepBlock(current, block.id, 1))}>
              <ArrowDown size={14} />
            </IconButton>
            <IconButton
              label="Usuń blok"
              danger
              onClick={() => {
                if (!filled(block) || confirm("Usunąć ten blok?")) onChange((current) => ops.removeBlock(current, block.id));
              }}
            >
              <Trash2 size={14} />
            </IconButton>
          </span>
        </div>

        {body}
      </div>
    </>
  );
}

function AddBlock({ empty, onAdd }: { empty: boolean; onAdd: (block: Block) => void }) {
  const [open, setOpen] = useState(false);

  function add(block: Block) {
    onAdd(block);
    setOpen(false);
  }

  if (empty || open) {
    return (
      <div className={empty ? styles.addEmpty : styles.addOpen}>
        {Object.values(BLOCK_KINDS).map((kind) => (
          <button key={kind.label} type="button" className={styles.addChoice} onClick={() => add(kind.create())}>
            <kind.icon size={16} aria-hidden="true" />
            {kind.label}
          </button>
        ))}
        {!empty && (
          <button type="button" className={styles.addCancel} onClick={() => setOpen(false)}>
            Anuluj
          </button>
        )}
      </div>
    );
  }

  return (
    <button type="button" className={styles.add} onClick={() => setOpen(true)}>
      <Plus size={15} aria-hidden="true" />
      Dodaj blok
    </button>
  );
}

function RowInserter({ onInsert }: { onInsert: (layout: Layout) => void }) {
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
    <div ref={ref} className={styles.inserter} data-open={open || undefined}>
      <button type="button" className={styles.inserterButton} onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <Plus size={14} aria-hidden="true" />
        Wiersz
      </button>
      {open && (
        <div className={styles.inserterMenu}>
          <LayoutPicker
            onPick={(layout) => {
              onInsert(layout);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function LayoutPicker({ onPick }: { onPick: (layout: Layout) => void }) {
  return (
    <div className={styles.picker}>
      {LAYOUTS.map((layout) => (
        <button key={layout} type="button" className={styles.pickerButton} title={LAYOUT_LABELS[layout]} onClick={() => onPick(layout)}>
          <LayoutIcon layout={layout} large />
          <span className={styles.srOnly}>{LAYOUT_LABELS[layout]}</span>
        </button>
      ))}
    </div>
  );
}

function LayoutIcon({ layout, large }: { layout: Layout; large?: boolean }) {
  return (
    <span className={large ? styles.layoutIconLarge : styles.layoutIcon} aria-hidden="true">
      {layoutParts(layout).map((part, index) => (
        <span key={index} style={{ flexGrow: part }} />
      ))}
    </span>
  );
}

function IconButton({
  label,
  disabled,
  danger,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={danger ? styles.iconDanger : styles.icon}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
