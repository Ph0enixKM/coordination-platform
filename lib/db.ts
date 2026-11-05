import { bindings } from "@/lib/cloudflare";

export type RunResult = { changes: number; lastRowId: number };

/** The slice of SQL both D1 and the local SQLite file answer the same way. */
export interface Db {
  all<T>(sql: string, ...params: unknown[]): Promise<T[]>;
  first<T>(sql: string, ...params: unknown[]): Promise<T | null>;
  run(sql: string, ...params: unknown[]): Promise<RunResult>;
}

// Neither driver takes `undefined` as a parameter.
const clean = (params: unknown[]) => params.map((value) => (value === undefined ? null : value));

let local: Promise<Db & { migrate: () => Promise<void> }> | undefined;

export async function getDb(): Promise<Db> {
  if (process.env.NODE_ENV === "production") {
    const { DB } = await bindings();

    return {
      all: async (sql, ...params) => (await DB.prepare(sql).bind(...clean(params)).all<never>()).results,
      first: (sql, ...params) => DB.prepare(sql).bind(...clean(params)).first(),
      run: async (sql, ...params) => {
        const { meta } = await DB.prepare(sql).bind(...clean(params)).run();

        return { changes: meta.changes, lastRowId: meta.last_row_id };
      },
    };
  }

  local ??= openLocal();

  const db = await local;
  // A dev server outlives new migration files, so look for them on every use.
  await db.migrate();

  return db;
}

/**
 * `next dev` keeps the blog in `.data/blog.sqlite` through Node's built-in
 * SQLite and applies `migrations/` itself, in the same order and bookkeeping
 * table Wrangler uses for D1.
 */
async function openLocal() {
  const { DatabaseSync }: typeof import("node:sqlite") = await import(/* webpackIgnore: true */ "node:sqlite");
  const fs = await import("node:fs");
  const path = await import("node:path");

  const dir = path.join(process.cwd(), ".data");
  fs.mkdirSync(dir, { recursive: true });

  const db = new DatabaseSync(path.join(dir, "blog.sqlite"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(`CREATE TABLE IF NOT EXISTS d1_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  const applied = new Set(
    (db.prepare("SELECT name FROM d1_migrations").all() as { name: string }[]).map((row) => row.name),
  );
  const migrations = path.join(process.cwd(), "migrations");

  const migrate = async () => {
    for (const name of fs.readdirSync(migrations).filter((file) => file.endsWith(".sql")).sort()) {
      if (applied.has(name)) continue;

      db.exec("BEGIN");
      try {
        db.exec(fs.readFileSync(path.join(migrations, name), "utf8"));
        db.prepare("INSERT INTO d1_migrations (name) VALUES (?)").run(name);
        db.exec("COMMIT");
        applied.add(name);
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    }
  };

  type Param = null | number | bigint | string | Uint8Array;

  const connection: Db & { migrate: typeof migrate } = {
    migrate,
    all: async (sql, ...params) => db.prepare(sql).all(...(clean(params) as Param[])) as never[],
    first: async (sql, ...params) => (db.prepare(sql).get(...(clean(params) as Param[])) as never) ?? null,
    run: async (sql, ...params) => {
      const result = db.prepare(sql).run(...(clean(params) as Param[]));

      return { changes: Number(result.changes), lastRowId: Number(result.lastInsertRowid) };
    },
  };

  return connection;
}
