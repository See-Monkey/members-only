#! /usr/bin/env node

import { loadEnvFile } from "node:process";
import pkg from "pg";

if (process.env.NODE_ENV !== "production") {
	loadEnvFile();
}

const { Client } = pkg;

const SQL = `
DROP TABLE IF EXISTS messages, users, roles CASCADE;

-- Roles table
CREATE TABLE roles (
  id INTEGER PRIMARY KEY,
  role VARCHAR(50) UNIQUE NOT NULL
);

-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  avatar_url TEXT,
  firstname VARCHAR(100),
  lastname VARCHAR(100)
);

-- Messages table
CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed roles
INSERT INTO roles (id, role)
VALUES
  (1, 'Viewer'),
  (2, 'Member'),
  (3, 'Admin');

-- Seed a test user (password must already be bcrypt-hashed)
-- Example hash is for password: "password123"
INSERT INTO users (username, password, role_id, firstname, lastname)
VALUES (
  'admin@example.com',
  '$2a$10$Q9YjZ7gQ5y6s9l8L8k6e0u0B0W8R1z0R2H1Z9F1Qz6q9Zx0cZzH3a',
  3,
  'Admin',
  'User'
);

-- Seed a message
INSERT INTO messages (message, user_id)
VALUES (
  'Hello world!',
  1
);
`;

async function main() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl:
			process.env.NODE_ENV === "production"
				? { rejectUnauthorized: false }
				: false,
	});

	try {
		console.log("Seeding database...");

		await client.connect();
		await client.query("BEGIN");
		await client.query(SQL);
		await client.query("COMMIT");

		console.log("Done");
	} catch (err) {
		console.error("Seed failed, rolling back:", err.message);
		await client.query("ROLLBACK");
	} finally {
		await client.end();
	}
}

main();
