import { query } from "../util/db.js";

const signUpDb = async (provider, name, email, password_hash) => {
  const [result] = await query(
    `
    INSERT INTO users (provider, name, email, password_hash)
    VALUES (?, ?, ?, ?)
    `,
    [provider, name, email, password_hash]
  );
  const userId = result.insertId;
  return userId;
};

const checkEmail = async (email) => {
  const [result] = await query(
    `
  SELECT email FROM users
  WHERE email = ?
  `,
    [email]
  );
  return result.length === 0 ? false : true;
};

const getUserInfo = async (email) => {
  const [result] = await query(
    `
  SELECT * FROM users
  WHERE email = ?
  `,
    [email]
  );
  return result;
};

export { signUpDb, checkEmail, getUserInfo };
