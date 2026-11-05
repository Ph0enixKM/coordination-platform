-- OpenNext's page cache tags (binding NEXT_TAG_CACHE_D1, see open-next.config.ts):
-- when a save in /admin marks cached pages stale, the time is recorded here.
-- `opennextjs-cloudflare deploy` creates the same table; having it here too
-- keeps revalidation working whichever way the Worker was deployed.
CREATE TABLE IF NOT EXISTS revalidations (
  tag TEXT NOT NULL,
  revalidatedAt INTEGER NOT NULL,
  stale INTEGER,
  expire INTEGER DEFAULT NULL,
  UNIQUE(tag) ON CONFLICT REPLACE
);
