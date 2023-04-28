const whiteboard = (io, socket) => {
  socket.on("start-whiteboard", (roomId) => {
    socket.to(roomId).emit("start-whiteboard");
  });
  
  socket.on("move", (roomId, lastX, lastY, x, y, eraser, pen, width, height) => {
    socket.to(roomId).emit("move", lastX, lastY, x, y, eraser, pen, width, height);
  });
}

export { whiteboard };