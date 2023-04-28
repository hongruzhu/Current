import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import { redis } from "../util/cache.js";
import { getWhiteboardStatus } from "../controllers/whiteboard_controller.js";


const whiteboard = (io, socket) => {
  socket.on("start-whiteboard", (roomId, name) => {
    redis.hset("whiteboardStatus", roomId, name);
    socket.to(roomId).emit("start-whiteboard", name);
  });

  socket.on("stop-whiteboard", (roomId) => {
    socket.to(roomId).emit("stop-whiteboard");
    redis.hset("whiteboardStatus", roomId, "false");
  });

  socket.on(
    "move",
    (roomId, lastX, lastY, x, y, eraser, pen, width, height) => {
      socket
        .to(roomId)
        .emit("move", lastX, lastY, x, y, eraser, pen, width, height);
    }
  );
};

router.route("/getWhiteboardStatus").post(wrapAsync(getWhiteboardStatus));

export { whiteboard };
export { router as whiteboard_route };
