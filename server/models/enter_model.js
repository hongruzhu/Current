import { pool } from "../models/mysql_config.js";

const setConf = async (title, status) => {
  try {
    // FIXME:status換個名字，不然取名跟裡面存放的東西意思差太遠，可讀性低又難維護
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
    // FIXME: model可以不用寫try catch，寫了跟沒寫結果一樣
    throw new Error(error);
  }
}

const setConfHost = async (user_id, conference_id, role, name, email) => {
  try {
    await pool.query(
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
    await pool.query(
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
    await pool.query(
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