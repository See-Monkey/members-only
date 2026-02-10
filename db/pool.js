import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === "production"
			? { rejectUnauthorized: false }
			: false,
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export default pool;
