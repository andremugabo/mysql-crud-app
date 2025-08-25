const { Pool } = require("pg");

const ConnectDB = async () => {
  // Use SSL if DB_SSL is true, or if we're on Render (detected by hostname)
  const useSSL = process.env.DB_SSL === "true" || 
                 process.env.DB_HOST?.includes('render.com') ||
                 process.env.DB_HOST?.includes('render-postgres');

  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 5432,
    max: parseInt(process.env.DB_CONNECTIONLIMIT) || 10,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  });

  try {
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ Connected to database ${process.env.DB_DATABASE} at ${res.rows[0].now}`);

    const tableName = process.env.DB_TABLENAME || "users";
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(`✅ Table "${tableName}" created or already exists.`);
  } catch (err) {
    console.error("❌ Database setup error:", err);
    throw err;
  }

  return pool;
};

module.exports = ConnectDB;