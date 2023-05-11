import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import {
  getStartTime,
  getRoomTitle,
  joinRoom,
  hideCamera,
  showCamera,
  muteMic,
  unmuteMic,
} from "../controllers/concall_controller.js";

// FIXME:Socket.io的code，放在MVC的哪裡比較合適？
const conferenceCall = (io, socket) => {
  joinRoom(socket);
  hideCamera(socket);
  showCamera(socket);
  muteMic(socket);
  unmuteMic(socket);
};

router.route("/getStartTime").get(wrapAsync(getStartTime));
router.route("/getRoomTitle").post(wrapAsync(getRoomTitle));

export { conferenceCall };
export { router as concall_route };
