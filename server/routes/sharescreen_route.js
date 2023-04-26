import { redis } from "../util/cache.js";

const shareScreen = (io, socket) => {
  socket.on("start-share-screen", async (roomId) => {
    const status = await redis.hget("shareScreenStatus", roomId);
    if (status === "true") {
      socket.emit("already-share-screen", status);
      return;
    } 
    redis.hset("shareScreenStatus", roomId, "true");
    const shareUserSocketId = socket.id;
    socket.to(roomId).emit("start-share-screen", shareUserSocketId);
  });

  socket.on("give-peerScreenId", (socketId, peerId) => {
    socket.to(socketId).emit("give-peerScreenId", peerId);
  });

  socket.on("stop-share-screen", (roomId) => {
    redis.hset("shareScreenStatus", roomId, "false");
    socket.to(roomId).emit("stop-share-screen");
  });

  socket.on("new-give-peerScreenId", (roomId, peerId) => {
    socket.to(roomId).emit("new-give-peerScreenId", peerId);
  });
};

export { shareScreen };
