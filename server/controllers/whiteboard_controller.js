import { redis } from "../util/cache.js";

const getWhiteboardStatus = async (req, res) => {
  const { roomId } = req.body;
  const status = await redis.hget("whiteboardStatus", roomId);
  res.send(status);
};

export { getWhiteboardStatus };
