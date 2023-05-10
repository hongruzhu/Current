import { pool } from "../models/mysql_config.js";

const setConf = async (title, status) => {
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
}

const setConfHost = async (user_id, conference_id, role, name, email) => {
  await pool.query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [user_id, conference_id, role, name, email]
  );
};

const setConfStart = async (confId, start) => {
  await pool.query(
    `
  UPDATE conferences SET start = ? 
  where id = ?
  `,
    [start, confId]
  );
}

const getTitle = async (roomId) => {
  const [result] = await pool.query(
    `
  SELECT title FROM conferences
  WHERE status = ?
    `,
    [roomId]
  );
  return result[0].title;
}

const setConfGuests = async (userId, confId, role, name, email) => {
  await pool.query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [userId, confId, role, name, email]
  );
};

export { setConf, setConfHost, setConfStart, getTitle, setConfGuests };