CREATE TABLE roles (
    id   SERIAL PRIMARY KEY,
    name TEXT   UNIQUE NOT NULL
);

CREATE TABLE users (
    id            SERIAL     PRIMARY KEY,
    email         TEXT       UNIQUE NOT NULL,
    username      TEXT       UNIQUE NOT NULL,
    password_hash TEXT       NOT NULL,
    role_id       INT        NOT NULL  REFERENCES roles (id),
    created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE stories (
    id           SERIAL      PRIMARY KEY,
    author_id    INT         NOT NULL  REFERENCES users (id),
    title        TEXT        NOT NULL,
    description  TEXT       ,
    cover_url    TEXT       ,
    published_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE chapters (
    id             SERIAL      PRIMARY KEY,
    story_id       INT         NOT NULL  REFERENCES stories (id),
    title          TEXT        NOT NULL,
    content        TEXT        NOT NULL,
    chapter_number INT         NOT NULL,
    published_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (story_id, chapter_number)
);

CREATE TABLE comments (
    id         SERIAL      PRIMARY KEY,
    user_id    INT         NOT NULL  REFERENCES users (id),
    chapter_id INT         NOT NULL  REFERENCES chapters (id),
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE nested_comments (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES stories(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (story_id, user_id)
);

CREATE TABLE library (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  story_id INTEGER NOT NULL REFERENCES stories(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, story_id)
);