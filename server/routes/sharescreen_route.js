import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import {
  getShareScreenStatus,
  startShareScreen,
  givePeerScreenId,
  stopShareScreen,
  givePeerScreenIdToNew,
} from "../controllers/sharescreen_controller.js";

const shareScreen = (io, socket) => {
  startShareScreen(socket);
  givePeerScreenId(socket);
  stopShareScreen(socket);
  givePeerScreenIdToNew(socket);
};

router.route("/sharescreen/status").post(wrapAsync(getShareScreenStatus));

export { shareScreen };
export { router as shareScreen_route };
