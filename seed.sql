-- Roles
INSERT  INTO roles (
    name
)
VALUES             ('reader');

INSERT  INTO roles (
    name
)
VALUES             ('author');

INSERT  INTO roles (
    name
)
VALUES             ('admin');

-- Users (password for all: password123)
INSERT  INTO users (
    email,
    username,
    password_hash,
    role_id
)
VALUES             ('alice@example.com', 'alice', '$2b$10$dp3Ce./iY6NwsSq7HHHfU.Y3qJGVT4FnrE8vJcnYHGAoTc3wMPMiu', 2);

INSERT  INTO users (
    email,
    username,
    password_hash,
    role_id
)
VALUES             ('bob@example.com', 'bob', '$2b$10$dp3Ce./iY6NwsSq7HHHfU.Y3qJGVT4FnrE8vJcnYHGAoTc3wMPMiu', 1);

INSERT  INTO users (
    email,
    username,
    password_hash,
    role_id
)
VALUES             ('carol@example.com', 'carol', '$2b$10$dp3Ce./iY6NwsSq7HHHfU.Y3qJGVT4FnrE8vJcnYHGAoTc3wMPMiu', 2);

-- Stories
INSERT  INTO stories (
    author_id,
    title,
    description,
    published_at
)
VALUES               (1, 'The Clockwork Garden', 'A story about a garden that runs on gears and time.', NOW());

INSERT  INTO stories (
    author_id,
    title,
    description,
    published_at
)
VALUES               (1, 'A Whisper in the Attic', 'A short horror story about an old house.', NULL);

INSERT  INTO stories (
    author_id,
    title,
    description,
    published_at
)
VALUES               (3, 'The Last Lighthouse', 'The keeper of a lighthouse faces the end of an era.', NOW());

-- Chapters
INSERT  INTO chapters (
    story_id,
    title,
    content,
    chapter_number,
    published_at
)
VALUES                (1, 'The First Wind', 'In the garden, the brass roses turned. A slow tick echoed.', 1, NOW());

INSERT  INTO chapters (
    story_id,
    title,
    content,
    chapter_number,
    published_at
)
VALUES                (1, 'The Brass Sprout', 'Under the soil, gears clicked. Something new grew.', 2, NOW());

INSERT  INTO chapters (
    story_id,
    title,
    content,
    chapter_number,
    published_at
)
VALUES                (3, 'The Light That Failed', 'The lamp flickered once, twice, and then went dark.', 1, NOW());

INSERT  INTO chapters (
    story_id,
    title,
    content,
    chapter_number,
    published_at
)
VALUES                (3, 'The Last Rotation', 'The keeper climbed the stairs one final time.', 2, NOW());

-- Comments
INSERT  INTO comments (
    chapter_id,
    user_id,
    body
)
VALUES                (1, 2, 'This opening is beautiful. The imagery of the brass roses is wonderful.');

INSERT  INTO comments (
    chapter_id,
    user_id,
    body
)
VALUES                (3, 2, 'Chilling. You built the atmosphere perfectly.');

INSERT  INTO comments (
    chapter_id,
    user_id,
    body
)
VALUES                (1, 3, 'I love the worldbuilding here. Can''t wait to read more.');

-- Nested comments (replies)
INSERT  INTO nested_comments (
    comment_id,
    user_id,
    body
)
VALUES                       (1, 1, 'Thank you! I spent a long time on that scene.');

INSERT  INTO nested_comments (
    comment_id,
    user_id,
    body
)
VALUES                       (3, 1, 'Glad you like it, Carol! More coming soon.');