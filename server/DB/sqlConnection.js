import mysql from 'mysql2/promise'; // ✅ Required import for mysql2
import dotenv from 'dotenv';
dotenv.config();

const sqlPool = mysql.createPool({
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  charset: 'utf8mb4', // <- this is important
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default sqlPool;
