import { query } from "../util/db.js";

const getConfId = async (roomId) => {
  const [result] = await query(
    `
  SELECT id FROM conferences
  WHERE room_id = ?
  `,
    [roomId]
  );
  return result[0].id;
};

const closeConf = async (confId, status) => {
  await query(
    `
  UPDATE conferences SET room_id = ? 
  where id = ?
  `,
    [status, confId]
  );
};

export { getConfId, closeConf };