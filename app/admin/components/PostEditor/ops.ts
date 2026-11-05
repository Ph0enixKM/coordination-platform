import { newId, relayout, type Block, type Column, type Layout, type PostContent, type Row } from "@/lib/blog/content";

/** Pure edits of a post body; each returns a new document and leaves the old one alone. */

type Direction = -1 | 1;

const mapColumns = (content: PostContent, update: (column: Column) => Column): PostContent => ({
  ...content,
  rows: content.rows.map((row) => ({ ...row, columns: row.columns.map(update) })),
});

const swap = <T>(items: T[], index: number, direction: Direction) => {
  const target = index + direction;

  if (index < 0 || target < 0 || target >= items.length) return items;

  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];

  return next;
};

export function findBlock(content: PostContent, blockId: string) {
  for (const row of content.rows) {
    for (const column of row.columns) {
      const index = column.blocks.findIndex((block) => block.id === blockId);

      if (index >= 0) return { row, column, index, block: column.blocks[index] };
    }
  }

  return null;
}

export const updateBlock = (content: PostContent, blockId: string, patch: Partial<Block>) =>
  mapColumns(content, (column) => ({
    ...column,
    blocks: column.blocks.map((block) => (block.id === blockId ? ({ ...block, ...patch } as Block) : block)),
  }));

export const removeBlock = (content: PostContent, blockId: string) =>
  mapColumns(content, (column) => ({ ...column, blocks: column.blocks.filter((block) => block.id !== blockId) }));

export const insertBlock = (content: PostContent, columnId: string, index: number, block: Block) =>
  mapColumns(content, (column) => {
    if (column.id !== columnId) return column;

    const blocks = [...column.blocks];
    blocks.splice(index, 0, block);

    return { ...column, blocks };
  });

export const stepBlock = (content: PostContent, blockId: string, direction: Direction) =>
  mapColumns(content, (column) => ({
    ...column,
    blocks: swap(column.blocks, column.blocks.findIndex((block) => block.id === blockId), direction),
  }));

/** Drops a block at `index` of a column, as the drop indicator showed it. */
export function moveBlock(content: PostContent, blockId: string, columnId: string, index: number) {
  const found = findBlock(content, blockId);

  if (!found) return content;

  // Indices past the block's old slot shift up once it leaves its column.
  const target = found.column.id === columnId && found.index < index ? index - 1 : index;

  return insertBlock(removeBlock(content, blockId), columnId, target, found.block);
}

export const insertRow = (content: PostContent, index: number, row: Row) => {
  const rows = [...content.rows];
  rows.splice(index, 0, row);

  return { ...content, rows };
};

export const removeRow = (content: PostContent, rowId: string) => ({
  ...content,
  rows: content.rows.filter((row) => row.id !== rowId),
});

export const stepRow = (content: PostContent, rowId: string, direction: Direction) => ({
  ...content,
  rows: swap(content.rows, content.rows.findIndex((row) => row.id === rowId), direction),
});

export function duplicateRow(content: PostContent, rowId: string) {
  const index = content.rows.findIndex((row) => row.id === rowId);

  if (index < 0) return content;

  const source = content.rows[index];
  const copy: Row = {
    ...source,
    id: newId(),
    columns: source.columns.map((column) => ({
      id: newId(),
      blocks: column.blocks.map((block) => ({ ...block, id: newId() })),
    })),
  };

  return insertRow(content, index + 1, copy);
}

export const setLayout = (content: PostContent, rowId: string, layout: Layout) => ({
  ...content,
  rows: content.rows.map((row) => (row.id === rowId ? relayout(row, layout) : row)),
});
