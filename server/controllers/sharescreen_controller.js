import { redis } from "../util/cache.js";

const getShareScreenStatus = async (req, res) => {
  const { roomId } = req.body;
  const status = await redis.hget("shareScreenStatus", roomId);
  res.send(status);
};

export { getShareScreenStatus };