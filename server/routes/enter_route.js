import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
import {
  getRoomId,
  verifyRoomId,
  enterRoom,
  createRoomPage,
  createRoom
} from "../controllers/enter_controller.js";

router.route("/getRoomId").get(authenticateJWT, wrapAsync(getRoomId));
router.route("/concall").get(wrapAsync(verifyRoomId));
router
  .route("/createRoom")
  .get(wrapAsync(createRoomPage))
  .post(authenticateJWT, wrapAsync(createRoom));
router
  .route("/enterRoom")
  .get(wrapAsync(verifyRoomId))
  .post(wrapAsync(enterRoom));

export { router as enter_route };
