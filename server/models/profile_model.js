import { query } from "../util/db.js";

const getUserAllConf = async (userId) => {
  const [result] = await query(
    `
  SELECT conferences_id, role FROM users_conferences
  WHERE users_id = ?
  `,
    [userId]
  );
  return result;
};

const getConfData = async (confId) => {
  const [result] = await query(
    `
  SELECT title, start FROM conferences
  WHERE id = ?
  `,
    [confId]
  );
  return result[0];
};

const getConfMembers = async (confId) => {
  const [result] = await query(
    `
  SELECT role, name, email FROM users_conferences
  WHERE conferences_id = ?
  `,
    [confId]
  );
  return result;
};

const setUserImage = async (userId, image) => {
  await query(
    `
    UPDATE users SET picture = ? 
    where id = ?
    `,
    [image, userId]
  );
};

export { getUserAllConf, getConfData, getConfMembers, setUserImage };
