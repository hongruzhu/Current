import * as dotenv from "dotenv";
dotenv.config();

// To get __dirname (and __filename) back
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Express Initialization
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { PORT, API_VERSION } = process.env;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
import { index_route } from "./server/routes/index_route.js";
import { concall_route } from "./server/routes/concall_route.js";

app.use(index_route, concall_route);


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

server.listen(PORT, async () => {
  console.log(`Listening on port: ${PORT}`);
});
