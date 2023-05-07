import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import {
  reviseRoomUserNumber,
  deleteRoomId,
  getStartTime,
  getRoomTitle,
  deleteStartTime,
  deleteShareScreenStatus,
  deleteWhiteboardStatus,
  checkWhiteboardPeerId,
  resetWhiteboardStatus
} from "../controllers/concall_controller.js";

import { getConfId, changeConfStatus } from "../models/concall_model.js";

const conferenceCall = (io, socket) => {
  socket.on("join-room", (roomId, peerId, name, role, picture) => {
    socket.join(roomId);
    const socketId = socket.id;
    socket
      .to(roomId)
      .emit("user-connected", peerId, name, role, picture, socketId);
    reviseRoomUserNumber(roomId, 1);

    socket.on("disconnect", async () => {
      socket.to(roomId).emit("user-disconnected", peerId);
      const whiteboardPeerId = await checkWhiteboardPeerId(roomId);
      if (peerId === whiteboardPeerId) {
        await resetWhiteboardStatus(roomId);
      }
      const count = await reviseRoomUserNumber(roomId, -1);
      if (count === 0) {
        const confId = await getConfId(roomId);
        await changeConfStatus(confId, "closed");
        deleteRoomId(roomId);
        deleteStartTime(roomId);
        deleteShareScreenStatus(roomId);
        deleteWhiteboardStatus(roomId);
      }
    });
  });
  socket.on("hide-camera", (roomId, peerId) => {
    socket.to(roomId).emit("hide-camera", peerId);
  });
  socket.on("show-camera", (roomId, peerId) => {
    socket.to(roomId).emit("show-camera", peerId);
  });

  socket.on("mute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("mute-mic", peerId);
  });
  socket.on("unmute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("unmute-mic", peerId);
  });
};

router.route("/getStartTime").get(wrapAsync(getStartTime));
router.route("/getRoomTitle").post(wrapAsync(getRoomTitle));

export { conferenceCall };
export { router as concall_route };
