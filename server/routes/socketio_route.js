import {
  reviseRoomUserNumber,
  deleteRoomId,
} from "../controllers/socketio_controller.js";

const liveStreaming = (io, socket) => {
  socket.on("join-room", (roomId, peerId, name) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId, name);
    reviseRoomUserNumber(roomId, 1);

    socket.on("disconnect", async () => {
      socket.to(roomId).emit("user-disconnected", peerId);
      const count = await reviseRoomUserNumber(roomId, -1);
      if (count === 0) {
        deleteRoomId(roomId);
      }
    });
  });
  socket.on("hide-camera", (roomId, peerId) => {
    socket.to(roomId).emit("hide-camera", peerId);
  });
  socket.on("show-camera", (roomId, peerId) => {
    socket.to(roomId).emit("show-camera", peerId);
  });
}

export { liveStreaming };
