const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("successfully connected to the db");
    client.release();
  } catch (err) {
    console.error("error connecting to the db", err);
  } finally {
    await pool.end();
  }
}

testConnection();
