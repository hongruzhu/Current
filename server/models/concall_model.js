import { pool } from "../models/mysql_config.js";

const getConfId = async (roomId) => {
  try {
    const [result] = await pool.query(
      `
    SELECT id FROM conferences
    WHERE status = ?
    `,
      [roomId]
    );
    return result[0].id;
  } catch (error) {
    throw new Error(error);
  }
};

const changeConfStatus = async (confId, status) => {
  try {
    const [result] = await pool.query(
      `
    UPDATE conferences SET status = ? 
    where id = ?
    `,
      [status, confId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

export { getConfId, changeConfStatus };