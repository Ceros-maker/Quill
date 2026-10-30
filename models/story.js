const db = require('../db');

async function listPublished() {
  const result = await db.query(`
    SELECT stories.*, users.username AS author_username,
      (SELECT AVG(rating)::numeric(3,1) FROM reviews WHERE reviews.story_id = stories.id) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE reviews.story_id = stories.id) AS review_count
    FROM stories
    JOIN users ON users.id = stories.author_id
    WHERE stories.published_at IS NOT NULL
    ORDER BY stories.created_at DESC
  `);
  return result.rows;
}

async function listPublishedByAuthor(authorId) {
    const result = await db.query(`
        SELECT id, title, cover_url, created_at
        FROM stories
        WHERE author_id = $1 AND published_at IS NOT NULL
        ORDER BY created_at DESC
    `, [authorId]);
    return result.rows;
}

async function listByAuthor(authorId) {
    const result = await db.query(`
        SELECT stories.*, users.username AS author_username
        FROM stories
        JOIN users ON users.id = stories.author_id
        WHERE stories.author_id = $1
        ORDER BY stories.created_at DESC
    `, [authorId]);
    return result.rows;
}

async function listDraftsByAuthor(authorId) {
    const result = await db.query(`
        SELECT id, title, cover_url, created_at
        FROM stories
        WHERE author_id = $1 AND published_at IS NULL
        ORDER BY created_at DESC
    `, [authorId]);
    return result.rows;
}

async function findById(id) {
    const result = await db.query(`
        SELECT stories.*, users.username AS author_username
        FROM stories
        JOIN users ON users.id = stories.author_id
        WHERE stories.id = $1
    `, [id]);
    return result.rows[0];
}

async function create({ authorId, title, description, coverUrl, published }) {
    const result = await db.query(`
        INSERT INTO stories (author_id, title, description, cover_url, published_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [authorId, title, description, coverUrl || null, published ? new Date() : null]);
    return result.rows[0];
}

async function publish(id) {
    const result = await db.query(
        'UPDATE stories SET published_at = NOW() WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

async function update(id, { title, description, coverUrl }) {
    const result = await db.query(`
        UPDATE stories
        SET title = $1, description = $2, cover_url = $3
        WHERE id = $4
        RETURNING *
    `, [title, description, coverUrl, id]);
    return result.rows[0];
}

async function remove(id) {
    await db.query('DELETE FROM stories WHERE id = $1', [id]);
}

module.exports = { listPublished, listPublishedByAuthor, listByAuthor, listDraftsByAuthor, findById, create, publish, update, remove };