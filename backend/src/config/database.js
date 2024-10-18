const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const query = (text, params) => pool.query(text, params);

const initDatabase = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log("database initialized");
  } catch (error) {
    console.error("error initializing database:", error);
  }
};

module.exports = { query, initDatabase };
