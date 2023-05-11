import { pool } from "../util/db.js";

const setConfDb = async (title, roomId) => {
  // FIXME:status換個名字，不然取名跟裡面存放的東西意思差太遠，可讀性低又難維護
  const [result] = await pool.query(
    `
  INSERT INTO conferences (title, room_id)
  VALUES (?, ?)
  `,
    [title, roomId]
  );
  const confId = result.insertId;
  return confId;
};

const saveConfHostDb = async (user_id, conference_id, role, name, email) => {
  await pool.query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [user_id, conference_id, role, name, email]
  );
};

const saveConfStartDb = async (confId, start) => {
  await pool.query(
    `
  UPDATE conferences SET start = ? 
  where id = ?
  `,
    [start, confId]
  );
};

const saveConfGuestsDb = async (userId, confId, role, name, email) => {
  await pool.query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [userId, confId, role, name, email]
  );
};

export { setConfDb, saveConfHostDb, saveConfStartDb, saveConfGuestsDb };
