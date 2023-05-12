import { redis } from "../util/cache.js";

const getShareScreenStatus = async (roomId) => {
  return await redis.hget("shareScreenStatus", roomId);
};

const setShareScreenStatus = async (roomId, peerScreenId) => {
  redis.hset("shareScreenStatus", roomId, peerScreenId);
};

export { getShareScreenStatus, setShareScreenStatus };
