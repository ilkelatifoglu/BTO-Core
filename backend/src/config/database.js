const { Pool } = require("pg");

const pool = new Pool({
<<<<<<< HEAD
  connectionString: process.env.DB_URL,
=======
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// Test the connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to the database');
    release();
  }
>>>>>>> eb535f5f8c7379c6181da29222da98a146017cda
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };