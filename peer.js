import express from "express";
import { PeerServer } from "peer";
const app = express();

import cors from "cors";
app.use(cors());

PeerServer({
  port: 3001,
  path: "/myapp",
  proxied: true,
});
