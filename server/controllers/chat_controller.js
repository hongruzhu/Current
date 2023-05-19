const chatMessage = async (socket) => {
  socket.on("chat-message", (roomId, name, msg) => {
    socket.to(roomId).emit("chat-message", name, msg);
  });
}

export { chatMessage };