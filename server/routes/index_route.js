import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import { index, getRoomId } from "../controllers/index_controller.js";

router.route("/").get(wrapAsync(index));
router.route("/getRoomId").get(wrapAsync(getRoomId));

export { router as index_route };