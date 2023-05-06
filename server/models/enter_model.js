import { pool } from "../models/mysql_config.js";

const setConf = async (title, status) => {
  try {
    const [result] = await pool.query(
      `
    INSERT INTO conferences (title, status)
    VALUES (?, ?)
    `,
      [title, status]
    );
    const confId = result.insertId;
    return confId;
  } catch (error) {
    throw new Error(error);
  }
}

const setConfHost = async (user_id, conference_id, role, name, email) => {
  try {
    const [result] = await pool.query(
      `
    INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
    VALUES (?, ?, ?, ?, ?)
    `,
      [user_id, conference_id, role, name, email]
    );
  } catch (error) {
    throw new Error(error);
  }
};

const setConfStart = async (confId, start) => {
  try {
    const [result] = await pool.query(
      `
    UPDATE conferences SET start = ? 
    where id = ?
    `,
      [start, confId]
    );
  } catch (error) {
    throw new Error(error);
  }
}

const getTitle = async (roomId) => {
  try {
    const [result] = await pool.query(
      `
    SELECT title FROM conferences
    WHERE status = ?
      `,
      [roomId]
    );
    return result[0].title;
  } catch (error) {
    throw new Error(error);
  }
}

const setConfGuests = async (userId, confId, role, name, email) => {
  try {
    const [result] = await pool.query(
      `
    INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
    VALUES (?, ?, ?, ?, ?)
    `,
      [userId, confId, role, name, email]
    );
  } catch (error) {
    throw new Error(error);
  }
};

export { setConf, setConfHost, setConfStart, getTitle, setConfGuests };