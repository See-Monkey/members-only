import bcrypt from "bcryptjs";
import pool from "../db/pool.js";

async function createUser({
	username,
	password,
	firstname,
	lastname,
	role_id,
	avatar_url,
}) {
	const hashedPassword = await bcrypt.hash(password, 10);

	const query = `
    INSERT INTO users
      (username, password, firstname, lastname, role_id, avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

	const values = [
		username,
		hashedPassword,
		firstname,
		lastname,
		role_id,
		avatar_url,
	];

	const { rows } = await pool.query(query, values);
	return rows[0];
}

async function updateUserRole(userId, roleId) {
	const query = `
		UPDATE users
		SET role_id = $1
		WHERE id = $2
	`;
	await pool.query(query, [roleId, userId]);
}

async function updateUser(id, { firstname, lastname, avatar_url }) {
	const query = `
		UPDATE users
		SET firstname = $1,
		    lastname = $2,
		    avatar_url = $3
		WHERE id = $4
		RETURNING *
	`;

	const values = [firstname, lastname, avatar_url, id];
	const { rows } = await pool.query(query, values);
	return rows[0];
}

export default {
	createUser,
	updateUserRole,
	updateUser,
};
