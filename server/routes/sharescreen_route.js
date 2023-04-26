const shareScreen = (io, socket) => {
  socket.on("start-share-screen", (roomId, name) => {
    const shareUserSocketId = socket.id;
    socket.to(roomId).emit("start-share-screen", shareUserSocketId, name);
  });

  socket.on("give-peerScreenId", (socketId, peerId) => {
    socket.to(socketId).emit("give-peerScreenId", peerId);
  });

  socket.on("stop-share-screen", (roomId) => {
    socket.to(roomId).emit("stop-share-screen");
  });
}

export { shareScreen };
