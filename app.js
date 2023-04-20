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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
import { index_route } from "./server/routes/index_route.js";
import { user_route } from "./server/routes/user_route.js";
import { concall_route } from "./server/routes/concall_route.js";

app.use(index_route, user_route, concall_route);

// Socket.IO routes
import { liveStreaming } from "./server/routes/socketio_route.js"

const onConnection = (socket) => {
  liveStreaming(io, socket);
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
