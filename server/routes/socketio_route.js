const liveStreaming = (io, socket) => {
  socket.on("join-room", (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);
    
  });
  socket.on("disconnect", () => {
    socket.to(roomId).emit("user-disconnected", peerId);
  });
}

export { liveStreaming };
