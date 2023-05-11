import {
  getShareScreenStatusCache,
  setShareScreenStatusCache,
} from "../service/sharescreen_cache.js";

const startShareScreen = async (socket) => {
  socket.on("start-share-screen", async (roomId, peerScreenId) => {
    const status = await getShareScreenStatusCache(roomId);
    if (status !== null && status !== "") {
      socket.emit("already-share-screen", status);
      return;
    }
    await setShareScreenStatusCache(roomId, peerScreenId);
    const shareUserSocketId = socket.id;
    socket.to(roomId).emit("start-share-screen", shareUserSocketId);

    socket.on("disconnect", async () => {
      const status = await getShareScreenStatusCache(roomId);
      if (status === peerScreenId) {
        socket.to(roomId).emit("shareScreen-user-disconnected", peerScreenId);
        await setShareScreenStatusCache(roomId, null);
      }
    });
  });
};

const givePeerScreenId = async (socket) => {
  socket.on("give-peerScreenId", (socketId, peerId) => {
    socket.to(socketId).emit("give-peerScreenId", peerId);
  });
};

const stopShareScreen = async (socket) => {
  socket.on("stop-share-screen", async (roomId) => {
    await setShareScreenStatusCache(roomId, null);
    socket.to(roomId).emit("stop-share-screen");
  });
};

const givePeerScreenIdToNew = async (socket) => {
  socket.on("give-peerScreenId-to-new", (roomId, peerId) => {
    socket.to(roomId).emit("give-peerScreenId-to-new", peerId);
  });
};

const getShareScreenStatus = async (req, res) => {
  const { roomId } = req.body;
  const status = await getShareScreenStatusCache(roomId);
  res.json({ data: status });
};

export {
  getShareScreenStatus,
  startShareScreen,
  givePeerScreenId,
  stopShareScreen,
  givePeerScreenIdToNew,
};
