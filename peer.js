import { PeerServer } from "peer";

PeerServer({
  port: 3001,
  path: "/myapp",
  proxied: true,
});
