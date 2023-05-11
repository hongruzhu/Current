import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import {
  getWhiteboardStatus,
  startWhiteboard,
  stopWhiteboard,
  captureDrawingPath,
  clearWhiteboard,
  shareWhiteboardToNew,
  shareWhiteboardState,
} from "../controllers/whiteboard_controller.js";

router.route("/getWhiteboardStatus").post(wrapAsync(getWhiteboardStatus));

const whiteboard = (io, socket) => {
  startWhiteboard(socket);
  stopWhiteboard(socket);
  captureDrawingPath(socket);
  clearWhiteboard(socket);
  shareWhiteboardToNew(socket);
  shareWhiteboardState(socket);
};

export { whiteboard };
export { router as whiteboard_route };
