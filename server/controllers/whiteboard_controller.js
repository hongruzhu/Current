import { redis } from "../util/cache.js";

const getWhiteboardStatus = async (req, res) => {
  const { roomId } = req.body;
  const name = await redis.hget("whiteboardShareName", roomId);
  const peerId = await redis.hget("whiteboardSharePeerId", roomId);
  const status = { name, peerId };
  res.send(status);
};

export { getWhiteboardStatus };
