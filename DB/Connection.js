// dbConnection.js

const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');
// dotenv.config({ path: '../.env' }); // טוען את משתני הסביבה

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Sari2005",
  database: "finalProject",
  multipleStatements: true,
});

// בדיקת חיבור בלי top-level await
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to MySQL:', err.message);
  });

module.exports = pool;
