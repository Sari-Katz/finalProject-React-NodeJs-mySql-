// dbConnection.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); 
const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  multipleStatements: true,
});

// בדיקת חיבור בלי top-level await
pool.getConnection()
  .then(conn => {
    console.log('✅Connected to MySQL!');
    conn.release();
  })
  .catch(err => {
    console.error('❌Error connecting to MySQL:', err.message);
  });

module.exports = pool;
