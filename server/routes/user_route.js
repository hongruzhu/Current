import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import {
  renderSignInPage,
  renderSignUpPage,
  signUp,
  signIn
} from "../controllers/user_controller.js";

router
  .route("/signin")
  .get(wrapAsync(renderSignInPage))
  .post(wrapAsync(signIn));
router
  .route("/signup")
  .get(wrapAsync(renderSignUpPage))
  .post(wrapAsync(signUp));

export { router as user_route };