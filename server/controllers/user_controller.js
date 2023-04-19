import validator from "validator";
import { signUpDb } from "../models/user_model.js";

const renderSignInPage = async (req, res) => {
  res.render("signin");
};

const renderSignUpPage = async (req, res) => {
  res.render("signup");
};

const signUp = async (req, res) => {
  let { name, email, password, password_confirmed } = req.body;
  name = validator.escape(name);
  const state = await signUpValidation(
    res,
    name,
    email,
    password,
    password_confirmed
  );
  if (state) return;
  const result = await signUpDb(name, email, password);
  res.json(result);
};

export { renderSignInPage, renderSignUpPage, signUp };

const signUpValidation = async (
  res,
  name,
  email,
  password,
  password_confirmed
) => {
  if (!name) {
    res.status(400).json({ err: "Please enter your name" });
    return true;
  }
  if (!email) {
    res.status(400).json({ err: "Please enter your email" });
    return true;
  }
  if (!password) {
    res.status(400).json({ err: "Please enter your password" });
    return true;
  }
  if (!validator.isLength(password, { min: 8, max: 12 })) {
    res.status(400).json({ err: "Password length should be between 8 to 12" });
    return true;
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    res.status(400).json({
      err: "Password should have at least 1 lowercase, 1 number, and 1 uppercase",
    });
    return true;
  }
  if (!password_confirmed) {
    res.status(400).json({ err: "Please confirm your password" });
    return true;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ err: "Please enter correct email format" });
    return true;
  }
  if (password !== password_confirmed) {
    res
      .status(400)
      .json({ err: "Confirm password unsuccessfully. Please check again" });
    return true;
  }
  return false;
};