import {
  reviseRoomUserNumber,
  deleteRoomId,
  deleteStartTime,
  deleteShareScreenStatus,
  deleteWhiteboardStatus,
  checkWhiteboardPeerId,
  resetWhiteboardStatus,
  getCacheStartTime,
  getCacheTitle,
} from "../service/concall_cache.js";

import { getConfId, changeConfStatus } from "../models/concall_model.js";

const getStartTime = async (req, res) => {
  const { roomId } = req.query;
  const startTime = await getCacheStartTime(roomId);
  res.send(startTime);
};

const getRoomTitle = async (req, res) => {
  const { roomId } = req.body;
  let roomTitle = await getCacheTitle(roomId);
  if (!roomTitle) roomTitle = "無";
  res.send(roomTitle);
};

const joinRoom = async (socket) => {
  socket.on("join-room", (roomId, peerId, name, role, picture) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId, name, role, picture);
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
};

const hideCamera = async (socket) => {
  socket.on("hide-camera", (roomId, peerId) => {
    socket.to(roomId).emit("hide-camera", peerId);
  });
};

const showCamera = async (socket) => {
  socket.on("show-camera", (roomId, peerId) => {
    socket.to(roomId).emit("show-camera", peerId);
  });
};

const muteMic = async (socket) => {
  socket.on("mute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("mute-mic", peerId);
  });
};

const unmuteMic = async (socket) => {
  socket.on("unmute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("unmute-mic", peerId);
  });
};

export {
  getStartTime,
  getRoomTitle,
  joinRoom,
  hideCamera,
  showCamera,
  muteMic,
  unmuteMic,
};
