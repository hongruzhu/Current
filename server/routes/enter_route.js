import express from "express";
const router = express.Router();

import { wrapAsync, authenticateJWT } from "../util/util.js";
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
  .get(wrapAsync(createRoomPage))
  .post(authenticateJWT, wrapAsync(createRoom));
router
  .route("/room/enter")
  .get(wrapAsync(verifyRoomId))
  .post(wrapAsync(enterRoom));

export { router as enter_route };
