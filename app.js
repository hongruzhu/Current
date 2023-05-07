import * as dotenv from "dotenv";
dotenv.config();

// Get __dirname (and __filename) back in ES6
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
const { PORT } = process.env;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

// API routes
import { index_route } from "./server/routes/index_route.js";
import { user_route } from "./server/routes/user_route.js";
import { enter_route } from "./server/routes/enter_route.js";
import { concall_route } from "./server/routes/concall_route.js";
import { shareScreen_route } from "./server/routes/sharescreen_route.js"; 
import { whiteboard_route } from "./server/routes/whiteboard_route.js";
import { recording_route } from "./server/routes/recording_route.js";
import { profile_route } from "./server/routes/profile_route.js";

app.use(
  index_route,
  user_route,
  enter_route,
  concall_route,
  shareScreen_route,
  whiteboard_route,
  recording_route,
  profile_route
);

// Socket.IO routes
import { conferenceCall } from "./server/routes/concall_route.js";
import { chat } from "./server/routes/chat_route.js";
import { shareScreen } from "./server/routes/sharescreen_route.js";
import { whiteboard } from "./server/routes/whiteboard_route.js";

const onConnection = (socket) => {
  conferenceCall(io, socket);
  chat(io, socket);
  shareScreen(io, socket);
  whiteboard(io, socket);
}

io.on("connection", onConnection);

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

server.listen(PORT, async () => {
  console.log(`Listening on port: ${PORT}`);
});
