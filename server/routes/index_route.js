import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
import { index, checkAccessToken } from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));
router
  .route("/checkAccessToken")
  .get(authenticateJWT, wrapAsync(checkAccessToken));

export { router as index_route };