import {
  reviseRoomUserNumber,
  deleteRoomId,
} from "../controllers/concall_controller.js";

const conferenceCall = (io, socket) => {
  socket.on("join-room", (roomId, peerId, name) => {
    socket.join(roomId);
    const socketId = socket.id;
    socket.to(roomId).emit("user-connected", peerId, name, socketId);
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

  socket.on("mute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("mute-mic", peerId);
  })
  socket.on("unmute-mic", (roomId, peerId) => {
    socket.to(roomId).emit("unmute-mic", peerId);
  })
}

export { conferenceCall };
