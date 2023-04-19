import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../models/mysql_config.js";
const { TOKEN_EXPIRE, TOKEN_SECRET_KEY } = process.env;

const signUpDb = async (name, email, password) => {
  try {
    const provider = "native";
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `
      INSERT INTO users (provider, name, email, password_hash)
      VALUES (?, ?, ?, ?)
      `,
      [provider, name, email, password_hash]
    );
    const payload = {
      provider,
      name,
      email,
      password_hash,
    };
    const accessToken = jwt.sign(payload, TOKEN_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRE,
    });
    const response = {
      accessToken,
      TOKEN_EXPIRE,
      user: {
        id: result.insertId,
        provider,
        name,
        email,
      },
    };
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
export { signUpDb };
