import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = mysql
  .createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  })
  .promise();

export { pool };
