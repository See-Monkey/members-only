import pool from "../db/pool.js";

async function getAllMessages() {
	const query = `
    SELECT 
      messages.id,
      messages.message,
      messages.created_at,
      users.id AS user_id,
      users.username,
      users.avatar_url
    FROM messages
    INNER JOIN users
      ON messages.user_id = users.id
    ORDER BY messages.created_at DESC
  `;
	const { rows } = await pool.query(query);
	return rows;
}

async function createMessage({ message, user_id }) {
	const query = `
    INSERT INTO messages (message, user_id)
    VALUES ($1, $2)
    RETURNING id
  `;
	const values = [message, user_id];
	const { rows } = await pool.query(query, values);
	return rows[0];
}

export default {
	getAllMessages,
	createMessage,
};
