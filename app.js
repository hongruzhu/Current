import * as dotenv from "dotenv";
dotenv.config();

// Express Initialization
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// live streaming
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, peerId) => {
    // User加入此roomId的會議室
    socket.join(roomId);
    const newUserSocketId = socket.id;
    socket.to(roomId).emit("user-connected", peerId, newUserSocketId);
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", peerId);
    });
  });
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

server.listen(port, async () => {
  console.log(`Listening on port: ${port}`);
});
