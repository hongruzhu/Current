import express from "express";
const router = express.Router();
import { wrapAsync } from "../util/util.js";
import { redis } from "../util/cache.js";
import { getShareScreenStatus } from "../controllers/sharescreen_controller.js";


const shareScreen = (io, socket) => {
  socket.on("start-share-screen", async (roomId, peerScreenId) => {
    const status = await redis.hget("shareScreenStatus", roomId);
    if (status !== null && status !== "") {
      socket.emit("already-share-screen", status);
      return;
    }
    redis.hset("shareScreenStatus", roomId, peerScreenId);
    const shareUserSocketId = socket.id;
    socket.to(roomId).emit("start-share-screen", shareUserSocketId);

    socket.on("disconnect", async () => {
      const status = await redis.hget("shareScreenStatus", roomId);
      if (status === peerScreenId) {
        socket.to(roomId).emit("shareScreen-user-disconnected", peerScreenId);
        redis.hset("shareScreenStatus", roomId, null);
      }
    });
  });

  socket.on("give-peerScreenId", (socketId, peerId) => {
    socket.to(socketId).emit("give-peerScreenId", peerId);
  });

  socket.on("stop-share-screen", (roomId) => {
    redis.hset("shareScreenStatus", roomId, null);
    socket.to(roomId).emit("stop-share-screen");
  });

  socket.on("new-give-peerScreenId", (roomId, peerId) => {
    socket.to(roomId).emit("new-give-peerScreenId", peerId);
  });
};

router.route("/getShareScreenStatus").post(wrapAsync(getShareScreenStatus));

export { shareScreen };
export { router as shareScreen_route };
