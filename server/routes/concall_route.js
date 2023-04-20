import express from "express";
const router = express.Router();

import { wrapAsync } from "../util/util.js";
import {
  getRoomId,
  verifyRoomId,
  enterRoom,
} from "../controllers/concall_controller.js";

router.route("/getRoomId").get(wrapAsync(getRoomId));
router.route("/concall").get(wrapAsync(verifyRoomId));
router
  .route("/enterRoom")
  .get(wrapAsync(verifyRoomId))
  .post(wrapAsync(enterRoom));

export { router as concall_route };
