import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import { getRoomId, verifyConfNumber } from "../controllers/concall_controller.js";

router.route("/getRoomId").get(wrapAsync(getRoomId));
router.route("/concall").get(wrapAsync(verifyConfNumber));

export { router as concall_route };
