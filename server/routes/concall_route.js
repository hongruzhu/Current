import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import { verifyRoomId } from "../controllers/enter_controller.js";
import {
  getStartTime,
  getRoomTitle,
  joinRoom,
  hideCamera,
  showCamera,
  muteMic,
  unmuteMic,
} from "../controllers/concall_controller.js";

const conferenceCall = (io, socket) => {
  joinRoom(socket);
  hideCamera(socket);
  showCamera(socket);
  muteMic(socket);
  unmuteMic(socket);
};

router.route("/concall").get(wrapAsync(verifyRoomId));
router.route("/concall/time").get(wrapAsync(getStartTime));
router.route("/concall/title").post(wrapAsync(getRoomTitle));

export { conferenceCall };
export { router as concall_route };
