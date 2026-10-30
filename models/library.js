const db = require('../db');

async function listByUser(userId) {
    const result = await db.query(`
        SELECT stories.*, users.username AS author_username, library.added_at
        FROM library
        JOIN stories ON stories.id = library.story_id
        JOIN users ON users.id = stories.author_id
        WHERE library.user_id = $1
        ORDER BY library.added_at DESC
    `, [userId]);

    return result.rows;
}

async function isSaved(userId, storyId) {
    const result = await db.query(
        'SELECT id FROM library WHERE user_id = $1 AND story_id = $2',
        [userId, storyId]
    );
    return result.rows.length > 0;
}

async function add(userId, storyId) {
    await db.query(`
        INSERT INTO library (user_id, story_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, story_id) DO NOTHING
    `, [userId, storyId]);
}

async function remove(userId, storyId) {
    await db.query(
        'DELETE FROM library WHERE user_id = $1 AND story_id = $2',
        [userId, storyId]
    );
}

module.exports = { listByUser, isSaved, add, remove };