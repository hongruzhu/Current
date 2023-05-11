import { redis } from "../util/cache.js";
import { setShareWhiteboardUser } from "../service/whiteboard_cache.js";

const getWhiteboardStatus = async (req, res) => {
  const { roomId } = req.body;
  const name = await redis.hget("whiteboardShareName", roomId);
  const peerId = await redis.hget("whiteboardSharePeerId", roomId);
  const status = { name, peerId };
  res.send(status);
};

const startWhiteboard = async (socket) => {
  socket.on("start-whiteboard", async (roomId, name, peerId) => {
    await setShareWhiteboardUser(roomId, name, peerId);
    socket.to(roomId).emit("start-whiteboard", name, peerId);
  });
}

const stopWhiteboard = async (socket) => {
  socket.on("stop-whiteboard", async (roomId) => {
    await setShareWhiteboardUser(roomId, null, null);
    socket.to(roomId).emit("stop-whiteboard");
  });
}

const captureDrawingPath = async (socket) => {
    socket.on(
    "move",
    (roomId, lastX, lastY, x, y, color, lineWidth, width, height) => {
      socket
        .to(roomId)
        .emit("move", lastX, lastY, x, y, color, lineWidth, width, height);
    }
  );
}

const clearWhiteboard = async (socket) => {
  socket.on("clear-whiteboard", (roomId) => {
    socket.to(roomId).emit("clear-whiteboard");
  })
}

const shareWhiteboardToNew = async (socket) => {
  socket.on("new-user-whiteboard", (roomId) => {
    const socketId = socket.id;
    socket.to(roomId).emit("new-user-whiteboard", socketId);
  });
}

const shareWhiteboardState = async (socket) => {
  socket.on(
    "whiteboard-state",
    (state, socketId) => {
      socket
        .to(socketId)
        .emit("whiteboard-state", state);
    }
  );
}

export { getWhiteboardStatus, startWhiteboard, stopWhiteboard, captureDrawingPath, clearWhiteboard, shareWhiteboardToNew, shareWhiteboardState };
