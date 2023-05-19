import * as dotenv from "dotenv";
dotenv.config();
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpDb, checkEmail, getUserInfo } from "../models/user_model.js";
import { CustomError } from "../util/error.js";
const { TOKEN_EXPIRE, TOKEN_SECRET_KEY } = process.env;

const renderSignInPage = async (req, res) => {
  res.render("signin");
};

const renderSignUpPage = async (req, res) => {
  res.render("signup");
};

const signUp = async (req, res) => {
  let { name, email, password, password_confirmed } = req.body;
  await signUpValidation(
    name,
    email,
    password,
    password_confirmed
  );
  const check = await checkEmail(email);
  if (check) throw CustomError.forbidden("此信箱已註冊過，請輸入其他信箱");
  const provider = "native";
  const password_hash = await bcrypt.hash(password, 10);
  const id = await signUpDb(provider, name, email, password_hash);
  const picture = null;
  const data = await generateResponse(id, provider, name, email, picture);
  res.json({data});
};

const signIn = async (req, res) => {
  let { email, password } = req.body;
  await signInValidation(email, password);
  const result = await getUserInfo(email);
  if (result.length === 0) throw CustomError.forbidden("此信箱尚未註冊");
  const { id, provider, name, password_hash, picture } = result[0];
  const checkPassword = await bcrypt.compare(password, password_hash);
  if (!checkPassword) throw CustomError.forbidden("密碼輸入錯誤，請重新輸入密碼");
  const data = await generateResponse(id, provider, name, email, picture);
  res.json({data});
};

export { renderSignInPage, renderSignUpPage, signUp, signIn };

const signUpValidation = async (name, email, password, password_confirmed) => {
  if (!name) throw CustomError.badRequest("請輸入你的姓名");
  if (!email) throw CustomError.badRequest("請輸入你的 email");
  if (!password) throw CustomError.badRequest("請輸入你的密碼");
  if (!validator.isLength(password, { min: 8, max: 12 })) throw CustomError.badRequest("密碼長度需8到12位");
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) throw CustomError.badRequest("密碼需大小寫字母及數字各1位");
  if (!password_confirmed) throw CustomError.badRequest("請確認你的密碼");
  if (!validator.isEmail(email)) throw CustomError.badRequest("請輸入正確的 email格式");
  if (password !== password_confirmed) throw CustomError.badRequest("確認密碼失敗，請確認密碼輸入正確");
  return null;
};

const signInValidation = async (email, password) => {
  if (!email) throw CustomError.badRequest("請輸入你的 email");
  if (!validator.isEmail(email)) throw CustomError.badRequest("請輸入正確的 email格式");
  if (!password) throw CustomError.badRequest("請輸入你的密碼");
  if (!validator.isLength(password, { min: 8, max: 12 })) throw CustomError.badRequest("密碼長度需8到12位");
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) throw CustomError.badRequest("密碼需大小寫字母及數字至少各1位");
  return null;
};

const generateResponse = async (id, provider, name, email, picture) => {
  const payload = {
    id,
    provider,
    name,
    email,
    picture,
  };
  const accessToken = jwt.sign(payload, TOKEN_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRE,
  });
  const response = {
    accessToken,
    TOKEN_EXPIRE,
    user: {
      id,
      provider,
      name,
      email,
      picture,
    },
  };
  return response;
};
