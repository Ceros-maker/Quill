const db = require('../db');

async function listByChapter(chapterId) {
  const result = await db.query(`
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.chapter_id = $1
    ORDER BY comments.created_at ASC
  `, [chapterId]);
  return result.rows;
}

async function listRecentByUser(userId, limit = 5) {
  const result = await db.query(`
    SELECT comments.*, chapters.title AS chapter_title, chapters.story_id, stories.title AS story_title
    FROM comments
    JOIN chapters ON chapters.id = comments.chapter_id
    JOIN stories ON stories.id = chapters.story_id
    WHERE comments.user_id = $1
    ORDER BY comments.created_at DESC
    LIMIT $2
  `, [userId, limit]);
  return result.rows;
}

async function create({ chapterId, userId, body }) {
  const result = await db.query(`
    INSERT INTO comments (chapter_id, user_id, body)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [chapterId, userId, body]);
  return result.rows[0];
}

module.exports = { listByChapter, listRecentByUser, create };