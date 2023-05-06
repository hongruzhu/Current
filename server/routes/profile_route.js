import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
import {
  getProfilePage,
  getRecord,
} from "../controllers/profile_controller.js";

router.route("/profile").get(wrapAsync(getProfilePage));
router.route("/getRecord").post(authenticateJWT, wrapAsync(getRecord));

export { router as profile_route };