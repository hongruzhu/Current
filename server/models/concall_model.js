import { pool } from "../models/mysql_config.js";

const getConfId = async (roomId) => {
  const [result] = await pool.query(
    `
  SELECT id FROM conferences
  WHERE status = ?
  `,
    [roomId]
  );
  return result[0].id;
};

const changeConfStatus = async (confId, status) => {
  await pool.query(
    `
  UPDATE conferences SET status = ? 
  where id = ?
  `,
    [status, confId]
  );
};

export { getConfId, changeConfStatus };