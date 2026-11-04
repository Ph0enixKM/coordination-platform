-- Blog posts and the images uploaded for them. The same file runs on D1
-- (`npm run db:migrate:remote`) and on the local SQLite file `next dev` uses.

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'publish')),
  excerpt TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  -- JSON arrays of strings.
  categories TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  -- JSON image ({ src, alt, width, height }) or NULL.
  cover TEXT,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  focus_keyword TEXT NOT NULL DEFAULT '',
  -- JSON document of rows > columns > blocks, see lib/blog/content.ts.
  content TEXT NOT NULL DEFAULT '{"version":1,"rows":[]}',
  -- The WordPress post this one was imported from, so a re-import updates it.
  wp_id INTEGER UNIQUE,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX posts_status_published ON posts (status, published_at DESC);

CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Object key in R2 (or under .data/media locally); the public URL is /media/<key>.
  key TEXT NOT NULL UNIQUE,
  -- SHA-256 of the uploaded file: uploading the same image twice reuses the first.
  hash TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  original_name TEXT NOT NULL DEFAULT '',
  width INTEGER,
  height INTEGER,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
