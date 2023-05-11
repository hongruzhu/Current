import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT, checkRoomIdMiddle } from "../util/util.js";
import {
  getRoomId,
  verifyRoomId,
  enterRoom,
  createRoomPage,
  createRoom,
} from "../controllers/enter_controller.js";

router.route("/room").get(authenticateJWT, wrapAsync(getRoomId));
router
  .route("/room/create")
  .get(checkRoomIdMiddle, wrapAsync(createRoomPage))
  .post(authenticateJWT, checkRoomIdMiddle, wrapAsync(createRoom));
router
  .route("/room/enter")
  .get(wrapAsync(verifyRoomId))
  .post(checkRoomIdMiddle, wrapAsync(enterRoom));

export { router as enter_route };
