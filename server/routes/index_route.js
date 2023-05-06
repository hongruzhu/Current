import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
import { index, checkAccessToken, thankyou, getProfile } from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));
router.route("/thankyou").get(wrapAsync(thankyou));
router
  .route("/checkAccessToken")
  .get(authenticateJWT, wrapAsync(checkAccessToken));
router.route("/profile").get(wrapAsync(getProfile));

export { router as index_route };