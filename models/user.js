const db = require('../db');

async function findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}

async function findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];    
}

async function findByUsername(username) {
    const result = await db.query(
        'SELECT id, username, bio, avatar_url, created_at FROM users WHERE username  = $1', [username]
    );
    return result.rows[0];
}

async function updatedProfile(id, { bio, avatarUrl }) {
    
}

async function create({ email, username, passwordHash, roleId }) {
    const result = await db.query(
        'INSERT INTO users (email, username, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, username, passwordHash, roleId]
    );
    return result.rows[0];
}

module.exports = { findByEmail, findById, findByUsername, create };