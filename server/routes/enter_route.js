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

// FIXME:API取名沒有符合RESTFUL API格式，有點差太多了，比較常用的是dash，不是camelCase
router.route("/getRoomId").get(authenticateJWT, wrapAsync(getRoomId));
router
  .route("/createRoom")
  .get(wrapAsync(createRoomPage))
  .post(authenticateJWT, wrapAsync(createRoom));
router
  .route("/enterRoom")
  .get(wrapAsync(verifyRoomId))
  .post(wrapAsync(enterRoom));
router.route("/concall").get(wrapAsync(verifyRoomId));

export { router as enter_route };
