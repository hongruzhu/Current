import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
import {
  index,
  checkAccessToken,
  thankyou,
} from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));
router.route("/thank").get(wrapAsync(thankyou));
router.route("/token").get(authenticateJWT, wrapAsync(checkAccessToken));

export { router as index_route };
