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

const query = async (sql, params) => {
  return await pool.query(sql, params);
};

// FIXME:不要把整個pool export出去，以免外面誤用中斷連線，把pool.query寫成function包出去就好
export { query };
