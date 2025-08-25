// Import pg (node-postgres) for PostgreSQL
const { Pool } = require("pg");

// Async function to connect to PostgreSQL database
const ConnectDB = async () => {
  // Create a pool for connections
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 5432,
    max: parseInt(process.env.DB_CONNECTIONLIMIT) || 10, 
    ssl: {
      rejectUnauthorized: false 
    }
  });

  try {
    // Test connection
    const res = await pool.query("SELECT NOW()");
    console.log(`Connected to database ${process.env.DB_DATABASE} at ${res.rows[0].now}`);

    // Create table if not exists
    const tableName = process.env.DB_TABLENAME || "users";
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(`${tableName} table created or already exists.`);
  } catch (err) {
    console.error("Database setup error:", err);
    throw err;
  }

  return pool; // return pool for queries
};

// Export the function
module.exports = ConnectDB;
