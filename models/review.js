const db = require('../db');

async function listByStory(storyId) {
    const result = await db.query(`
        SELECT reviews.*, users.username
        FROM reviews
        JOIN users ON users.id = reviews.user_id
        WHERE reviews.story_id = $1
        ORDER BY reviews.created_at DESC
    `, [storyId]);
    return result.rows;
}

async function findByUserAndStory(userId, storyId) {
    const result = await db.query(
        'SELECT * FROM reviews WHERE user_id = $1 AND story_id = $2',
        [userId, storyId]
    );
    return result.rows[0];
}

async function create({ storyId, userId, rating, body }) {
    const result = await db.query(`
        INSERT INTO reviews (story_id, user_id, rating, body)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [storyId, userId, rating, body]);
    return result.rows[0];
}

async function update(id, { rating, body }) {
    const result = await db.query(`
        UPDATE reviews
        SET rating = $1, body = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
    `, [rating, body, id]);
    return result.rows[0];
}

async function getAverage(storyId) {
    const result = await db.query(`
        SELECT
          AVG(rating)::numeric(3,1) AS average,
          COUNT(*) AS count
        FROM reviews
        WHERE story_id = $1
    `, [storyId]);
    return result.rows[0];
}

module.exports = { listByStory, findByUserAndStory, create, update, getAverage };