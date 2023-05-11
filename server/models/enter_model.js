import { query } from "../util/db.js";

const setConfDb = async (title, roomId) => {
  const [result] = await query(
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
  await query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [user_id, conference_id, role, name, email]
  );
};

const saveConfStartDb = async (confId, start) => {
  await query(
    `
  UPDATE conferences SET start = ? 
  where id = ?
  `,
    [start, confId]
  );
};

const saveConfGuestsDb = async (userId, confId, role, name, email) => {
  await query(
    `
  INSERT INTO users_conferences (users_id, conferences_id, role, name, email)
  VALUES (?, ?, ?, ?, ?)
  `,
    [userId, confId, role, name, email]
  );
};

export { setConfDb, saveConfHostDb, saveConfStartDb, saveConfGuestsDb };
