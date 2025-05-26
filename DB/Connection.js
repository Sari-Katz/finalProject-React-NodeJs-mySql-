// dbConnection.js
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // מסלול מותאם, שנה במידת הצורך

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
});

import pool from './dbConnection.js';

try {
  const connection = await pool.getConnection();
  console.log('Connected to MySQL!');
  connection.release();
} catch (err) {
  console.error('Error connecting to MySQL:', err);
}


export default pool;