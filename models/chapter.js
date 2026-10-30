const db = require('../db');

async function listByStory(storyId) {
    const result = await db.query(`
        SELECT * FROM chapters
        WHERE story_id = $1
        ORDER BY chapter_number ASC
    `, [storyId]);
    return result.rows;
}

async function findById(id) {
    const result = await db.query('SELECT * FROM chapters WHERE id = $1', [id]);
    return result.rows[0];
}

async function create({ storyId, title, content }) {
    const nextResult = await db.query(`
        SELECT COALESCE(MAX(chapter_number), 0) + 1 AS next_number
        FROM chapters
        WHERE story_id = $1
    `, [storyId]);
    const chapterNumber = nextResult.rows[0].next_number;

    const result = await db.query(`
        INSERT INTO chapters (story_id, title, content, chapter_number, published_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
    `, [storyId, title, content, chapterNumber]);
    return result.rows[0];
}

async function update(id, { title, content }) {
    const result = await db.query(`
        UPDATE chapters
        SET title = $1, content = $2
        WHERE id = $3
        RETURNING *
    `, [title, content, id]);
    return result.rows[0];
}

async function remove(id) {
    await db.query('DELETE FROM chapters WHERE id = $1', [id]);
}

module.exports = { listByStory, findById, create, update, remove };