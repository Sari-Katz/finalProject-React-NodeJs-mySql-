// dbConnection.js
// import dotenv from 'dotenv';

// dotenv.config({ path: '../.env' }); // עדכני אם צריך

import mysql from 'mysql2/promise';
console.log(process.env.MYSQL_USER, process.env.MYSQL_PASSWORD);

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sari2005",
  database:"finalProject",
  multipleStatements: true,
});

try {
  const connection = await pool.getConnection();
  console.log('Connected to MySQL!');
  connection.release();
} catch (err) {
  console.error('Error connecting to MySQL:', err);
}

export default pool;
