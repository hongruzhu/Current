import * as dotenv from "dotenv";
dotenv.config();
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpDb, checkEmail, getUserInfo } from "../models/user_model.js";
const { TOKEN_EXPIRE, TOKEN_SECRET_KEY } = process.env;

const renderSignInPage = async (req, res) => {
  res.render("signin");
};

const renderSignUpPage = async (req, res) => {
  res.render("signup");
};

const signUp = async (req, res) => {
  let { name, email, password, password_confirmed } = req.body;
  const state = await signUpValidation(
    name,
    email,
    password,
    password_confirmed
  );
  if (state) {
    res.status(state.status).send({ err: state.err });
    return;
  }
  const check = await checkEmail(email);
  if (check) {
    res.status(403).send({ err: "此信箱已註冊過，請輸入其他信箱" });
    return;
  }
  const provider = "native";
  const password_hash = await bcrypt.hash(password, 10);
  const id = await signUpDb(provider, name, email, password_hash);
  const picture = null;
  const response = await generateResponse(id, provider, name, email, picture);
  res.json(response);
};

const signIn = async (req, res) => {
  let { email, password } = req.body;
  const state = await signInValidation(email, password);
  if (state) {
    res.status(state.status).send({ err: state.err });
    return;
  }
  const result = await getUserInfo(email);
  if (result.length === 0) {
    res.status(403).send({ err: "此信箱尚未註冊" });
    return;
  }
  const { id, provider, name, password_hash, picture } = result[0];
  const checkPassword = await bcrypt.compare(password, password_hash);
  if (!checkPassword) {
    res.status(403).send({ err: `密碼輸入錯誤，請重新輸入密碼` });
    return;
  }
  const response = await generateResponse(id, provider, name, email, picture);
  res.json(response);
};

export { renderSignInPage, renderSignUpPage, signUp, signIn };

const signUpValidation = async (name, email, password, password_confirmed) => {
  if (!name) return { status: 400, err: "Please enter your name" };
  if (!email) return { status: 400, err: "Please enter your email" };
  if (!password) return { status: 400, err: "Please enter your password" };
  if (!validator.isLength(password, { min: 8, max: 12 }))
    return { status: 400, err: "Password length should be between 8 to 12" };
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  )
    return {
      status: 400,
      err: "Password should have at least 1 lowercase, 1 number, and 1 uppercase",
    };
  if (!password_confirmed)
    return { status: 400, err: "Please confirm your password" };
  if (!validator.isEmail(email))
    return { status: 400, err: "Please enter correct email format" };
  if (password !== password_confirmed)
    return {
      status: 400,
      err: "Confirm password unsuccessfully. Please check again",
    };
  return false;
};

const signInValidation = async (email, password) => {
  if (!email) return { status: 400, err: "Please enter your email" };
  if (!validator.isEmail(email))
    return { status: 400, err: "Please enter correct email format" };
  if (!password) return { status: 400, err: "Please enter your password" };
  if (!validator.isLength(password, { min: 8, max: 12 }))
    return { status: 400, err: "Password length should be between 8 to 12" };
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  )
    return {
      status: 400,
      err: "Password should have at least 1 lowercase, 1 number, and 1 uppercase",
    };
  return false;
};

const generateResponse = async (id, provider, name, email, picture) => {
  const payload = {
    id,
    provider,
    name,
    email,
    picture
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
      picture
    },
  };
  return response;
};
