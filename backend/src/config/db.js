const Pool = require("pg").Pool;

const pool =
  process.env.CONNECTION_STRING === undefined
    ? new Pool({
        user: "postgres",
        host: process.env.DB_HOST || "localhost",
        database: "oncampus",
        password: "postgres",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      })
    : new Pool({
        connectionString: process.env.CONNECTION_STRING,
      });

// Test connection
pool.query("SELECT 1", (err, res) => {
  if (err) {
    console.error("Error connecting to the database: ", err.stack);
  } else {
    console.log("Successfully connected to the database");
  }
});

module.exports = pool;
