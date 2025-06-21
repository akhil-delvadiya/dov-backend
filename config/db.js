
/** const connection = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});
 * 
 * const connection = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});
 *


*/

// Use DATABASE_URL from .env for Heroku
// db.js
const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || "5432", 10),
// });

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   ssl: isProduction
    ? { rejectUnauthorized: false } // Supabase / cloud DB needs SSL
    : false, // Local dev doesn't need SSL
});


// Test connection
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

module.exports = pool;