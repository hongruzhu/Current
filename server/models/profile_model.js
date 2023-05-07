import { pool } from "../models/mysql_config.js";

const getUserAllConf = async (userId) => {
  try {
    const [result] = await pool.query(
      `
    SELECT conferences_id, role FROM users_conferences
    WHERE users_id = ?
    `,
      [userId]
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getConfData = async (confId) => {
  try {
    const [result] = await pool.query(
      `
    SELECT title, start FROM conferences
    WHERE id = ?
    `,
      [confId]
    );
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const getConfMembers = async (confId) => {
  try {
    const [result] = await pool.query(
      `
    SELECT role, name, email FROM users_conferences
    WHERE conferences_id = ?
    `,
      [confId]
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const setUserImage = async (userId, image) => {
  try {
    const [result] = await pool.query(
      `
      UPDATE users SET picture = ? 
      where id = ?
      `,
      [image, userId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

export { getUserAllConf, getConfData, getConfMembers, setUserImage };
