const db = require('../db');

async function getRole(userId, storyId) {
  const result = await db.query(
    'SELECT role FROM story_roles WHERE user_id = $1 AND story_id = $2',
    [userId, storyId]
  );
  return result.rows[0] ? result.rows[0].role : null;
}

async function listByStory(storyId) {
  const result = await db.query(`
    SELECT story_roles.*, users.username
    FROM story_roles
    JOIN users ON users.id = story_roles.user_id
    WHERE story_roles.story_id = $1
    ORDER BY story_roles.assigned_at DESC
  `, [storyId]);
  return result.rows;
}

async function assign({ storyId, userId, role }) {
  const result = await db.query(`
    INSERT INTO story_roles (story_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (story_id, user_id) DO UPDATE SET role = $3
    RETURNING *
  `, [storyId, userId, role]);
  return result.rows[0];
}

async function remove(storyId, userId) {
  await db.query(
    'DELETE FROM story_roles WHERE story_id = $1 AND user_id = $2',
    [storyId, userId]
  );
}

module.exports = { getRole, listByStory, assign, remove };