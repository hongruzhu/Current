import express from "express";
import { PeerServer } from "peer";
const app = express();

import cors from "cors";
app.use(cors());

const peerServer = PeerServer({
  port: 3001,
  path: "/myapp",
  proxied: true,
});
