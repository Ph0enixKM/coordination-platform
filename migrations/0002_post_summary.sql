-- Plain-text teaser for post listings: the excerpt, or else the start of the
-- body. Filled in on every save, so listings never have to load `content`.
ALTER TABLE posts ADD COLUMN summary TEXT NOT NULL DEFAULT '';
